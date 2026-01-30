import { render, screen, waitFor } from '@testing-library/react'
import WalletConnect from '@components/auth/wallet-connect'
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'

describe('WalletConnect', () => {
  let accountState
  let onWeb3ProviderSet
  let onConnectionSuccess

  beforeEach(() => {
    jest.clearAllMocks()

    accountState = {
      address: null,
      connector: null,
      isConnected: false,
    }

    onWeb3ProviderSet = jest.fn()
    onConnectionSuccess = jest.fn()

    useAccount.mockImplementation(() => accountState)
  })

  const renderComponent = (props = {}) =>
    render(
      <WalletConnect
        onWeb3ProviderSet={onWeb3ProviderSet}
        onConnectionSuccess={onConnectionSuccess}
        {...props}
      />
    )

  const connectWith = ({
    address = '0x1234',
    connectorName = 'MetaMask',
    provider = { id: 'provider' },
    getProviderImpl,
    isConnected = true,
  } = {}) => {
    const connector = {
      name: connectorName,
      ready: true,
      getProvider: getProviderImpl || jest.fn().mockResolvedValue(provider),
    }

    accountState.address = address
    accountState.connector = connector
    accountState.isConnected = isConnected

    return { connector, provider }
  }

  it('renders heading and ConnectKit button', () => {
    renderComponent()

    expect(screen.getByRole('heading', { name: 'Connect Wallet' })).toBeInTheDocument()
    expect(screen.getByTestId('connectkit-button')).toBeInTheDocument()
    expect(ConnectKitButton).toHaveBeenCalled()
  })

  it('does not call callbacks when wagmi reports disconnected', async () => {
    renderComponent()

    await waitFor(() => {
      expect(onWeb3ProviderSet).not.toHaveBeenCalled()
      expect(onConnectionSuccess).not.toHaveBeenCalled()
    })
  })

  it('calls callbacks when connector provides a provider', async () => {
    const { rerender } = renderComponent() // Start disconnected

    const { connector, provider } = connectWith() // Then connect

    rerender(
      <WalletConnect
        onWeb3ProviderSet={onWeb3ProviderSet}
        onConnectionSuccess={onConnectionSuccess}
      />
    )

    await waitFor(() => {
      expect(connector.getProvider).toHaveBeenCalledTimes(1)
      expect(onWeb3ProviderSet).toHaveBeenCalledWith(provider)
      expect(onConnectionSuccess).toHaveBeenCalledWith({
        address: '0x1234',
        connector: 'MetaMask',
        provider,
      })
    })
  })

  it('only reports a successful connection once per transition', async () => {
    const { rerender } = renderComponent()
    const provider = { id: 'provider' }
    const connector = {
      name: 'MetaMask',
      ready: true,
      getProvider: jest.fn().mockResolvedValue(provider),
    }

    accountState.address = '0x1234'
    accountState.connector = connector
    accountState.isConnected = true

    rerender(
      <WalletConnect
        onWeb3ProviderSet={onWeb3ProviderSet}
        onConnectionSuccess={onConnectionSuccess}
      />
    )

    await waitFor(() => {
      expect(onConnectionSuccess).toHaveBeenCalledTimes(1)
    })

    rerender(
      <WalletConnect
        onWeb3ProviderSet={onWeb3ProviderSet}
        onConnectionSuccess={onConnectionSuccess}
      />
    )

    await waitFor(() => {
      expect(onConnectionSuccess).toHaveBeenCalledTimes(1)
    })
  })

  it('ignores connector callbacks when getProvider rejects', async () => {
    const { connector } = connectWith({
      getProviderImpl: jest.fn().mockRejectedValue(new Error('failed')),
    })

    renderComponent()

    await waitFor(() => {
      expect(connector.getProvider).toHaveBeenCalled()
      expect(onWeb3ProviderSet).not.toHaveBeenCalled()
      expect(onConnectionSuccess).not.toHaveBeenCalled()
    })
  })

  it('skips callbacks when connection info is incomplete', async () => {
    connectWith({ address: null })

    renderComponent()

    await waitFor(() => {
      expect(onWeb3ProviderSet).not.toHaveBeenCalled()
      expect(onConnectionSuccess).not.toHaveBeenCalled()
    })
  })
})
