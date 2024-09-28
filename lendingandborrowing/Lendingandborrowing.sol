// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "hardhat/console.sol";

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract XFILending {
    // XFI token for lending and borrowing
    IERC20 public XFIToken;

    // Struct to keep track of Lenders and Borrowers
    struct Lender {
        uint256 amountLent;
        uint256 interestRate;
        uint256 startTime;
    }

    struct Borrower {
        uint256 amountBorrowed;
        uint256 interestRate;
        uint256 startTime;
    }

    // Mapping of lender and borrower data
    mapping(address => Lender) public lenders;
    mapping(address => Borrower) public borrowers;

    // Interest rate for lending and borrowing
    uint256 public lendingInterestRate = 5; // Example: 5% annual interest for lending XFI
    uint256 public borrowingInterestRate = 8; // Example: 8% annual interest for borrowing XFI

    // Events to log activities
    event Lent(address indexed lender, uint256 amount, uint256 interestRate);
    event Borrowed(address indexed borrower, uint256 amount, uint256 interestRate);
    event Repayment(address indexed borrower, uint256 amount);
    event Withdrawal(address indexed lender, uint256 principal, uint256 interest);

    constructor(address _XFITokenAddress) {
        XFIToken = IERC20(_XFITokenAddress);
    }

    // Function for lending XFI tokens
    function lend(uint256 _amount) external {
        require(_amount > 0, "Amount should be more than zero");

        // Transfer XFI tokens to the contract
        require(XFIToken.transferFrom(msg.sender, address(this), _amount), "Transfer of XFI failed");

        lenders[msg.sender] = Lender({
            amountLent: _amount,
            interestRate: lendingInterestRate,
            startTime: block.timestamp
        });

        emit Lent(msg.sender, _amount, lendingInterestRate);
    }

    // Function for borrowing XFI tokens
    function borrow(uint256 _amount) external {

        require(_amount > 0, "Amount should be more than zero");

        // Ensure the contract has enough XFI to lend
        uint256 availableLiquidity = XFIToken.balanceOf(address(this));
        require(availableLiquidity >= _amount, "Not enough XFI liquidity");

        borrowers[msg.sender] = Borrower({
            amountBorrowed: _amount,
            interestRate: borrowingInterestRate,
            startTime: block.timestamp
        });

        // Transfer XFI tokens to the borrower
        require(XFIToken.transfer(msg.sender, _amount), "Borrow of XFI failed");

        emit Borrowed(msg.sender, _amount, borrowingInterestRate);
    }

    // Function to repay the XFI loan
    function repay(uint256 _amount) external {
        require(borrowers[msg.sender].amountBorrowed > 0, "No loan to repay");
        require(_amount > 0, "Amount should be more than zero");

        // Transfer repayment tokens (XFI) to the contract
        require(XFIToken.transferFrom(msg.sender, address(this), _amount), "Repayment of XFI failed");

        // Calculate the remaining balance after repayment
        borrowers[msg.sender].amountBorrowed -= _amount;

        // If the loan is fully repaid, remove the borrower from the mapping
        if (borrowers[msg.sender].amountBorrowed == 0) {
            delete borrowers[msg.sender];
        }

        emit Repayment(msg.sender, _amount);
    }

    // Function to withdraw lent XFI tokens and earned interest
    function withdrawLentAmount() external {
        Lender memory lender = lenders[msg.sender];
        require(lender.amountLent > 0, "No funds to withdraw");

        // Calculate the interest earned
        uint256 timePassed = block.timestamp - lender.startTime;
        uint256 interestEarned = (lender.amountLent * lender.interestRate * timePassed) / (1 days * 100);

        uint256 totalAmount = lender.amountLent + interestEarned;

        // Transfer the principal plus interest back to the lender
        require(XFIToken.transfer(msg.sender, totalAmount), "Withdrawal of XFI failed");

        // Remove lender from the mapping
        delete lenders[msg.sender];

        emit Withdrawal(msg.sender, lender.amountLent, interestEarned);
    }

    // View function to check how much interest a lender has earned in XFI
    function calculateLenderInterest(address _lender) public view returns (uint256) {
        Lender memory lender = lenders[_lender];
        uint256 timePassed = block.timestamp - lender.startTime;
        uint256 interestEarned = (lender.amountLent * lender.interestRate * timePassed) / (1 days * 100);
        return interestEarned;
    }

    // View function to calculate the debt a borrower owes in XFI
    function calculateBorrowerDebt(address _borrower) public view returns (uint256) {
        Borrower memory borrower = borrowers[_borrower];
        uint256 timePassed = block.timestamp - borrower.startTime;
        uint256 interestOwed = (borrower.amountBorrowed * borrower.interestRate * timePassed) / (1 days * 100);
        return borrower.amountBorrowed + interestOwed;
    }
}
