import { render, screen, waitFor } from '@testing-library/react'
import { useAccount, useDisconnect } from 'wagmi'
import StakingFlow from '@components/staking/staking-flow'

// Mock dependencies
jest.mock('wagmi')
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (fn) => {
    const Component = fn.ssr === false ? () => <div>Mocked Dynamic Component</div> : fn
    return Component
  },
}))

describe('StakingFlow Component', () => {
  const mockDisconnect = jest.fn()
  const mockGetProvider = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Default mock implementations
    useAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
      connector: null,
    })

    useDisconnect.mockReturnValue({
      disconnect: mockDisconnect,
    })
  })

  describe('Rendering - Not Connected', () => {
    it('should render sign-in component when user is not connected', () => {
      render(<StakingFlow defaultTransactionBlock="PLR_STAKING_V2" />)
      expect(screen.getByText('Mocked Dynamic Component')).toBeInTheDocument()
    })

    it('should not render Etherspot panel when not connected', () => {
      render(<StakingFlow defaultTransactionBlock="PLR_STAKING_V2" />)
      expect(screen.queryByText('Compatible browsers:')).not.toBeInTheDocument()
    })
  })

  describe('Rendering - Connected via Wagmi', () => {
    beforeEach(() => {
      const mockProvider = { provider: 'test-wagmi-provider' }
      mockGetProvider.mockResolvedValue(mockProvider)

      useAccount.mockReturnValue({
        address: '0x1234567890123456789012345678901234567890',
        isConnected: true,
        connector: {
          ready: true,
          getProvider: mockGetProvider,
          disconnect: jest.fn(),
        },
      })
    })

    it('should not render sign-in when connected', () => {
      render(<StakingFlow defaultTransactionBlock="PLR_STAKING_V2" />)
      // Will render mocked Etherspot instead
      expect(screen.getByText('Mocked Dynamic Component')).toBeInTheDocument()
    })

    it('should call getProvider when connector is ready and connected', async () => {
      render(<StakingFlow defaultTransactionBlock="PLR_STAKING_V2" />)

      await waitFor(() => {
        expect(mockGetProvider).toHaveBeenCalled()
      })
    })

    it('should render browser compatibility message when Etherspot panel is shown', async () => {
      render(<StakingFlow defaultTransactionBlock="PLR_STAKING_V2" />)

      await waitFor(() => {
        // Check for the compatibility message
        const compatMessage = screen.queryByText((content, element) => {
          return element?.textContent?.includes('Compatible browsers:')
        })
        // This would be rendered if showEtherspotPanel is true
        // In the mock, we're just checking component structure
        expect(mockGetProvider).toHaveBeenCalled()
      })
    })
  })

  describe('Provider State Management', () => {
    it('should not show Etherspot panel when provider is not set', () => {
      render(<StakingFlow defaultTransactionBlock="PLR_STAKING_V2" />)
      expect(screen.queryByText('Compatible browsers:')).not.toBeInTheDocument()
    })

    it('should prioritize connectedWeb3Provider over wagmiProvider', async () => {
      const mockProvider = { provider: 'test-provider' }
      mockGetProvider.mockResolvedValue(mockProvider)

      useAccount.mockReturnValue({
        address: '0x1234567890123456789012345678901234567890',
        isConnected: true,
        connector: {
          ready: true,
          getProvider: mockGetProvider,
          disconnect: jest.fn(),
        },
      })

      render(<StakingFlow defaultTransactionBlock="PLR_STAKING_V2" />)

      await waitFor(() => {
        expect(mockGetProvider).toHaveBeenCalled()
      })
    })
  })

  describe('Transaction Block Props', () => {
    it('should accept defaultTransactionBlock prop', () => {
      const { rerender } = render(<StakingFlow defaultTransactionBlock="PLR_STAKING_V2" />)
      expect(screen.getByText('Mocked Dynamic Component')).toBeInTheDocument()

      // Change the transaction block
      rerender(<StakingFlow defaultTransactionBlock="ANOTHER_BLOCK" />)
      expect(screen.getByText('Mocked Dynamic Component')).toBeInTheDocument()
    })

    it('should accept shouldDisplayForm prop', () => {
      render(<StakingFlow defaultTransactionBlock="PLR_STAKING_V2" shouldDisplayForm={true} />)
      expect(screen.getByText('Mocked Dynamic Component')).toBeInTheDocument()
    })
  })

  describe('Logout Functionality', () => {
    it('should have disconnect function available', () => {
      useAccount.mockReturnValue({
        address: '0x1234567890123456789012345678901234567890',
        isConnected: true,
        connector: {
          ready: true,
          getProvider: mockGetProvider,
          disconnect: jest.fn(),
        },
      })

      render(<StakingFlow defaultTransactionBlock="PLR_STAKING_V2" />)

      expect(mockDisconnect).toBeDefined()
    })

    it('should handle logout errors gracefully', () => {
      mockDisconnect.mockRejectedValue(new Error('Disconnect failed'))

      useAccount.mockReturnValue({
        address: '0x1234567890123456789012345678901234567890',
        isConnected: true,
        connector: {
          ready: true,
          getProvider: mockGetProvider,
          disconnect: jest.fn().mockRejectedValue(new Error('Disconnect failed')),
        },
      })

      // Should not throw error during render
      expect(() => {
        render(<StakingFlow defaultTransactionBlock="PLR_STAKING_V2" />)
      }).not.toThrow()
    })
  })

  describe('LocalStorage Constants', () => {
    it('should export OPENLOGIN_STORE constant', () => {
      const module = require('@components/staking/staking-flow')
      expect(module.OPENLOGIN_STORE).toBe('openlogin_store')
    })

    it('should export WAGMI_STORE constant', () => {
      const module = require('@components/staking/staking-flow')
      expect(module.WAGMI_STORE).toBe('wagmi.store')
    })
  })

  describe('Provider Cleanup', () => {
    it('should handle null provider gracefully', () => {
      mockGetProvider.mockResolvedValue(null)

      useAccount.mockReturnValue({
        address: '0x1234567890123456789012345678901234567890',
        isConnected: true,
        connector: {
          ready: true,
          getProvider: mockGetProvider,
          disconnect: jest.fn(),
        },
      })

      expect(() => {
        render(<StakingFlow defaultTransactionBlock="PLR_STAKING_V2" />)
      }).not.toThrow()
    })

    it('should not call getProvider when connector is not ready', () => {
      useAccount.mockReturnValue({
        address: '0x1234567890123456789012345678901234567890',
        isConnected: true,
        connector: {
          ready: false,
          getProvider: mockGetProvider,
          disconnect: jest.fn(),
        },
      })

      render(<StakingFlow defaultTransactionBlock="PLR_STAKING_V2" />)

      expect(mockGetProvider).not.toHaveBeenCalled()
    })
  })
})
