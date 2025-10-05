import { render, screen, waitFor } from '@testing-library/react'
import { useAccount, useDisconnect } from 'wagmi'
import GovernanceNftFlow from '@components/dao/governance-nft-flow'

jest.mock('@components/dao/nft-transaction', () => ({
  __esModule: true,
  default: () => <div>Mocked DAO Transaction</div>,
}))

describe('GovernanceNftFlow', () => {
  const mockDisconnect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    useAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
      connector: null,
    })

    useDisconnect.mockReturnValue({
      disconnect: mockDisconnect,
    })

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ isFormSubmitted: false }),
      })
    )
  })

  afterEach(() => {
    delete global.fetch
  })

  const renderFlow = (props = {}) => render(<GovernanceNftFlow shouldDisplayForm={true} {...props} />)

  it('renders ConnectKit button when user is not authenticated', () => {
    renderFlow()

    expect(screen.getByRole('heading', { name: 'Connect Wallet' })).toBeInTheDocument()
    expect(screen.getByTestId('connectkit-button')).toBeInTheDocument()
    expect(screen.queryByText('Mocked DAO Transaction')).not.toBeInTheDocument()
  })

  it('hides ConnectKit button when wagmi reports a connection', async () => {
    const connector = { disconnect: jest.fn() }
    useAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      isConnected: true,
      connector,
    })

    renderFlow({ shouldDisplayForm: false })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
      expect(screen.queryByTestId('connectkit-button')).not.toBeInTheDocument()
    })
  })

  it('fetches Notion data with wallet address when connected', async () => {
    const address = '0x1234567890123456789012345678901234567890'
    useAccount.mockReturnValue({
      address,
      isConnected: true,
      connector: { disconnect: jest.fn() },
    })

    renderFlow()

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/plr-dao-data',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining(address),
        })
      )
    })
  })

  it('displays transaction builder when form already submitted', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ isFormSubmitted: true }),
      })
    )

    useAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      isConnected: true,
      connector: { disconnect: jest.fn() },
    })

    renderFlow({ shouldDisplayForm: true })

    await waitFor(() => {
      expect(screen.getByText('Mocked DAO Transaction')).toBeInTheDocument()
    })
  })


  it('exports OpenLogin and Wagmi store constants', () => {
    const module = require('@components/dao/governance-nft-flow')
    expect(module.OPENLOGIN_STORE).toBe('openlogin_store')
    expect(module.WAGMI_STORE).toBe('wagmi.store')
  })
})
