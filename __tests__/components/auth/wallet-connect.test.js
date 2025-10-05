import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useConnect, useAccount } from 'wagmi'
import { usePrivy } from '@privy-io/react-auth'
import WalletConnect from '@components/auth/wallet-connect'

// Mock the wagmi and privy hooks
jest.mock('wagmi')
jest.mock('@privy-io/react-auth')

describe('WalletConnect Component', () => {
  const mockOnWeb3ProviderSet = jest.fn()
  const mockConnect = jest.fn()
  const mockPrivyLogin = jest.fn()
  const mockGetProvider = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Default mock implementations
    useConnect.mockReturnValue({
      connect: mockConnect,
      connectors: [
        { type: 'metaMask', name: 'MetaMask', ready: true },
        { type: 'walletConnect', name: 'WalletConnect', ready: true },
        { type: 'injected', name: 'Injected', ready: true },
      ],
    })

    useAccount.mockReturnValue({
      connector: {
        ready: false,
        getProvider: mockGetProvider,
      },
      isConnected: false,
    })

    usePrivy.mockReturnValue({
      login: mockPrivyLogin,
      ready: true,
      authenticated: false,
    })
  })

  describe('Rendering', () => {
    it('should render sign in title', () => {
      render(<WalletConnect onWeb3ProviderSet={mockOnWeb3ProviderSet} includeMM />)
      expect(screen.getByText('Sign in')).toBeInTheDocument()
    })

    it('should render MetaMask option when includeMM is true', () => {
      render(<WalletConnect onWeb3ProviderSet={mockOnWeb3ProviderSet} includeMM />)
      expect(screen.getByText('MetaMask')).toBeInTheDocument()
    })

    it('should render WalletConnect option when includeWC is true', () => {
      render(<WalletConnect onWeb3ProviderSet={mockOnWeb3ProviderSet} includeWC />)
      expect(screen.getByText('WalletConnect')).toBeInTheDocument()
    })

    it('should render Privy option when includePrivy is true', () => {
      render(<WalletConnect onWeb3ProviderSet={mockOnWeb3ProviderSet} includePrivy />)
      expect(screen.getByText('Privy')).toBeInTheDocument()
    })

    it('should render Other Browser Wallet option when includeInj is true', () => {
      render(<WalletConnect onWeb3ProviderSet={mockOnWeb3ProviderSet} includeInj />)
      expect(screen.getByText('Other Browser Wallet')).toBeInTheDocument()
    })

    it('should not render options when none are specified', () => {
      render(<WalletConnect onWeb3ProviderSet={mockOnWeb3ProviderSet} />)
      expect(screen.queryByText('MetaMask')).not.toBeInTheDocument()
      expect(screen.queryByText('WalletConnect')).not.toBeInTheDocument()
      expect(screen.queryByText('Privy')).not.toBeInTheDocument()
    })
  })

  describe('Wallet Connection', () => {
    it('should call connect with MetaMask connector when MetaMask is clicked', async () => {
      const user = userEvent.setup()
      render(<WalletConnect onWeb3ProviderSet={mockOnWeb3ProviderSet} includeMM />)

      const metaMaskButton = screen.getByText('MetaMask').closest('div')
      await user.click(metaMaskButton)

      expect(mockConnect).toHaveBeenCalledWith({
        connector: expect.objectContaining({ type: 'metaMask' }),
      })
    })

    it('should call connect with WalletConnect connector when WalletConnect is clicked', async () => {
      const user = userEvent.setup()
      render(<WalletConnect onWeb3ProviderSet={mockOnWeb3ProviderSet} includeWC />)

      const walletConnectButton = screen.getByText('WalletConnect').closest('div')
      await user.click(walletConnectButton)

      expect(mockConnect).toHaveBeenCalledWith({
        connector: expect.objectContaining({ type: 'walletConnect' }),
      })
    })

    it('should call Privy login when Privy option is clicked', async () => {
      const user = userEvent.setup()
      render(<WalletConnect onWeb3ProviderSet={mockOnWeb3ProviderSet} includePrivy />)

      const privyButton = screen.getByText('Privy').closest('div')
      await user.click(privyButton)

      expect(mockPrivyLogin).toHaveBeenCalled()
    })
  })

  describe('Provider Handling', () => {
    it('should call onWeb3ProviderSet when wagmi connector is ready and connected', async () => {
      const mockProvider = { provider: 'test-provider' }
      mockGetProvider.mockResolvedValue(mockProvider)

      useAccount.mockReturnValue({
        connector: {
          ready: true,
          getProvider: mockGetProvider,
        },
        isConnected: true,
      })

      render(<WalletConnect onWeb3ProviderSet={mockOnWeb3ProviderSet} includeMM />)

      await waitFor(() => {
        expect(mockOnWeb3ProviderSet).toHaveBeenCalledWith(mockProvider)
      })
    })

    it('should not call onWeb3ProviderSet when connector is not ready', () => {
      useAccount.mockReturnValue({
        connector: {
          ready: false,
          getProvider: mockGetProvider,
        },
        isConnected: true,
      })

      render(<WalletConnect onWeb3ProviderSet={mockOnWeb3ProviderSet} includeMM />)

      expect(mockOnWeb3ProviderSet).not.toHaveBeenCalled()
    })
  })

  describe('Loading State', () => {
    it('should show signing in state when Privy is authenticating', () => {
      usePrivy.mockReturnValue({
        login: mockPrivyLogin,
        ready: true,
        authenticated: false,
      })

      render(<WalletConnect onWeb3ProviderSet={mockOnWeb3ProviderSet} includePrivy />)

      // Trigger signing in state
      const privyButton = screen.getByText('Privy').closest('div')
      userEvent.click(privyButton)

      // The component should show loading state
      waitFor(() => {
        expect(screen.getByText('Signing in')).toBeInTheDocument()
      })
    })
  })

  describe('Multiple Wallet Options', () => {
    it('should render multiple wallet options when multiple includes are true', () => {
      render(
        <WalletConnect
          onWeb3ProviderSet={mockOnWeb3ProviderSet}
          includeMM
          includeWC
          includePrivy
        />
      )

      expect(screen.getByText('MetaMask')).toBeInTheDocument()
      expect(screen.getByText('WalletConnect')).toBeInTheDocument()
      expect(screen.getByText('Privy')).toBeInTheDocument()
    })
  })
})
