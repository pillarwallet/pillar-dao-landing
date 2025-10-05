import { render, screen, waitFor } from '@testing-library/react'
import StakingFlow from '@components/staking/staking-flow'
import { useAccount, useDisconnect } from 'wagmi'

jest.mock('@etherspot/react-transaction-buidler', () => ({
  __esModule: true,
  Etherspot: ({ onLogout }) => (
    <div>
      <div>Etherspot Panel</div>
      <button type="button" onClick={onLogout}>
        Mock Logout
      </button>
    </div>
  ),
}))

describe('StakingFlow', () => {
  const mockDisconnect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    useAccount.mockReturnValue({
      isConnected: false,
      connector: null,
    })

    useDisconnect.mockReturnValue({
      disconnect: mockDisconnect,
    })
  })

  const renderFlow = (props = {}) => render(<StakingFlow defaultTransactionBlock="PLR_STAKING_V2" {...props} />)

  it('renders ConnectKit button when wallet is not connected', () => {
    renderFlow()

    expect(screen.getByRole('heading', { name: 'Connect Wallet' })).toBeInTheDocument()
    expect(screen.getByTestId('connectkit-button')).toBeInTheDocument()
    expect(screen.queryByText('Etherspot Panel')).not.toBeInTheDocument()
  })

  it('shows Etherspot panel when wagmi connector resolves a provider', async () => {
    const provider = { id: 'provider' }
    const connector = {
      ready: true,
      getProvider: jest.fn().mockResolvedValue(provider),
      disconnect: jest.fn(),
    }

    useAccount.mockReturnValue({
      isConnected: true,
      connector,
    })

    renderFlow()

    await waitFor(() => {
      expect(connector.getProvider).toHaveBeenCalledTimes(1)
      expect(screen.getByText('Etherspot Panel')).toBeInTheDocument()
      expect(screen.queryByTestId('connectkit-button')).not.toBeInTheDocument()
    })
  })

  it('handles provider resolution errors gracefully', async () => {
    const connector = {
      ready: true,
      getProvider: jest.fn().mockRejectedValue(new Error('failed')),
      disconnect: jest.fn(),
    }

    useAccount.mockReturnValue({
      isConnected: true,
      connector,
    })

    renderFlow()

    await waitFor(() => {
      expect(connector.getProvider).toHaveBeenCalledTimes(1)
      expect(screen.queryByText('Etherspot Panel')).not.toBeInTheDocument()
    })
  })

  it('exports OpenLogin and Wagmi store constants', () => {
    const module = require('@components/staking/staking-flow')
    expect(module.OPENLOGIN_STORE).toBe('openlogin_store')
    expect(module.WAGMI_STORE).toBe('wagmi.store')
  })
})
