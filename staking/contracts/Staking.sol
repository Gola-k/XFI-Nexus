// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is ReentrancyGuard {
    using SafeMath for uint256;
    IERC20 public s_stakingToken;
    IERC20 public s_rewardToken;

    uint public constant REWARD_RATE = 46296296296296;
    uint private totalStakedTokens;
    uint public rewardPerTokenStored;
    uint public lastUpdateTime;
    address public owner;

    uint public constant LOCKUP_PERIOD = 2 days;
    uint public constant EARLY_WITHDRAWAL_PENALTY = 10; // 10% penalty

    mapping(address => uint) public stakedBalance;
    mapping(address => uint) public rewards;
    mapping(address => uint) public userRewardPerTokenPaid;
    mapping(address => uint) public lastStakeTime;

    event Staked(address indexed user, uint256 indexed amount);
    event Withdrawn(address indexed user, uint256 indexed amount, uint256 penalty);
    event RewardsClaimed(address indexed user, uint256 indexed amount);
    event PenaltyTransferred(address indexed user, uint256 indexed amount);
    
    constructor(address stakingToken, address rewardToken) {
        s_stakingToken = IERC20(stakingToken);
        s_rewardToken = IERC20(rewardToken);
        owner = msg.sender;
    }

    function rewardPerToken() public view returns (uint) {
        if (totalStakedTokens == 0) {
            return rewardPerTokenStored;
        }
        uint totalTime = block.timestamp.sub(lastUpdateTime);
        uint totalRewards = REWARD_RATE.mul(totalTime); 
        return rewardPerTokenStored.add(totalRewards.mul(1e18).div(totalStakedTokens));
    }

    function earned(address account) public view returns (uint) {
        return stakedBalance[account].mul(rewardPerToken().sub(userRewardPerTokenPaid[account])).div(1e18).add(rewards[account]);
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
        _;
    }

    function stake(uint amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");
        totalStakedTokens = totalStakedTokens.add(amount);
        stakedBalance[msg.sender] = stakedBalance[msg.sender].add(amount);
        lastStakeTime[msg.sender] = block.timestamp;
        emit Staked(msg.sender, amount);
        bool success = s_stakingToken.transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer Failed");
    }

    function withdrawStakedTokens(uint amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");
        require(stakedBalance[msg.sender] >= amount, "Staked amount not enough");

        uint penaltyAmount = 0;
        if (block.timestamp < lastStakeTime[msg.sender].add(LOCKUP_PERIOD)) {
            penaltyAmount = amount.mul(EARLY_WITHDRAWAL_PENALTY).div(100);
        }

        uint amountToWithdraw = amount.sub(penaltyAmount);
        totalStakedTokens = totalStakedTokens.sub(amount);
        stakedBalance[msg.sender] = stakedBalance[msg.sender].sub(amount);

        emit Withdrawn(msg.sender, amountToWithdraw, penaltyAmount);

        bool success = s_stakingToken.transfer(msg.sender, amountToWithdraw);
        require(success, "Transfer to user failed");

        if (penaltyAmount > 0) {
            success = s_stakingToken.transfer(owner, penaltyAmount);
            require(success, "Transfer of penalty to owner failed");
            emit PenaltyTransferred(msg.sender, penaltyAmount);
        }
    }

    function getReward() external nonReentrant updateReward(msg.sender) {
        uint reward = rewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        rewards[msg.sender] = 0;
        emit RewardsClaimed(msg.sender, reward);
        bool success = s_rewardToken.transfer(msg.sender, reward);
        require(success, "Transfer Failed");
    }
}

// Staking 0x07eA0AC41dE236f1EC2EB6eDf70dceF2BFbf61f4
// Reward 0xAF77f4CE0ee047F7191f54b8564eC800DE3CeF5d
// Stake Token 0x2E33249F0AAB1a41fe4987580bef3A1B8372eC3A