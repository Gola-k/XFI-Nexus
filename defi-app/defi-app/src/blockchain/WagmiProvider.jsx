import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { defineChain } from "viem"

const crossfi = defineChain({
    id: 4157,
    name: 'CrossFi Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'XFI',
      symbol: 'XFI',
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.testnet.ms'],
      },
    },
    blockExplorers: {
      default: { name: 'Explorer', url: 'https://scan.testnet.ms' },
    },
  });

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.walletconnect.com

const projectId = "f1e14696910030d671edc4604f9b525c";
// 2. Create wagmiConfig
const metadata = {
    name: 'XFI',
    description: 'XFI APP',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum, crossfi]
const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
})

// 3. Create modal
createWeb3Modal({
    metadata,
    wagmiConfig: config,
    projectId,
    enableAnalytics: true // Optional - defaults to your Cloud configuration
})

export function Web3Provider({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}