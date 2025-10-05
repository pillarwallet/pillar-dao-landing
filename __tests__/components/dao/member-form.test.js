import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MemberForm from '@components/dao/member-form'

describe('MemberForm Component', () => {
  const mockOnLogout = jest.fn()
  const mockOnSubmitForm = jest.fn()
  const defaultProps = {
    connector: null,
    defaultWalletAddress: '0x1234567890123456789012345678901234567890',
    defaultEmail: 'test@example.com',
    onLogout: mockOnLogout,
    onSubmitForm: mockOnSubmitForm,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    global.fetch.mockClear()
  })

  describe('Rendering', () => {
    it('should render form title', () => {
      render(<MemberForm {...defaultProps} />)
      expect(screen.getByText('PLR DAO Membership')).toBeInTheDocument()
    })

    it('should render all form fields', () => {
      render(<MemberForm {...defaultProps} />)

      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Address 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Address 2')).toBeInTheDocument()
      expect(screen.getByLabelText('City')).toBeInTheDocument()
      expect(screen.getByLabelText('State')).toBeInTheDocument()
      expect(screen.getByLabelText('Country')).toBeInTheDocument()
      expect(screen.getByLabelText('Zipcode')).toBeInTheDocument()
      expect(screen.getByLabelText('Wallet Address')).toBeInTheDocument()
    })

    it('should render submit button', () => {
      render(<MemberForm {...defaultProps} />)
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    })

    it('should render logout button', () => {
      render(<MemberForm {...defaultProps} />)
      const logoutButton = screen.getByTitle('Logout and Restart')
      expect(logoutButton).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    it('should populate email from defaultEmail prop', () => {
      render(<MemberForm {...defaultProps} />)
      const emailInput = screen.getByLabelText('Email')
      expect(emailInput).toHaveValue('test@example.com')
    })

    it('should populate wallet address from defaultWalletAddress prop', () => {
      render(<MemberForm {...defaultProps} />)
      const walletInput = screen.getByLabelText('Wallet Address')
      expect(walletInput).toHaveValue('0x1234567890123456789012345678901234567890')
    })

    it('should disable wallet address input when connector is present and address is set', () => {
      const props = {
        ...defaultProps,
        connector: { name: 'MetaMask' },
      }
      render(<MemberForm {...props} />)

      const walletInput = screen.getByLabelText('Wallet Address')
      expect(walletInput).toBeDisabled()
    })

    it('should show connector name when connector is provided', () => {
      const props = {
        ...defaultProps,
        connector: { name: 'MetaMask' },
      }
      render(<MemberForm {...props} />)

      expect(screen.getByText('MetaMask')).toBeInTheDocument()
    })
  })

  describe('Email Validation', () => {
    it('should validate email format correctly', async () => {
      const user = userEvent.setup()
      render(<MemberForm {...defaultProps} defaultEmail="" />)

      const emailInput = screen.getByLabelText('Email')

      // Enter invalid email
      await user.clear(emailInput)
      await user.type(emailInput, 'invalid-email')
      await user.tab() // Trigger blur

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
      })
    })

    it('should not show error for valid email', async () => {
      const user = userEvent.setup()
      render(<MemberForm {...defaultProps} defaultEmail="" />)

      const emailInput = screen.getByLabelText('Email')

      await user.clear(emailInput)
      await user.type(emailInput, 'valid@example.com')
      await user.tab()

      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument()
    })

    it('should show error only after email field is touched', async () => {
      const user = userEvent.setup()
      render(<MemberForm {...defaultProps} defaultEmail="" />)

      const emailInput = screen.getByLabelText('Email')

      // Type invalid email but don't blur
      await user.type(emailInput, 'invalid')

      // Error should not show yet
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument()

      // Blur to touch the field
      await user.tab()

      // Now error should show
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
      })
    })
  })

  describe('Wallet Address Validation', () => {
    it('should accept valid Ethereum address', async () => {
      const user = userEvent.setup()
      render(<MemberForm {...defaultProps} defaultWalletAddress="" />)

      const walletInput = screen.getByLabelText('Wallet Address')
      await user.type(walletInput, '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')

      // No error should be shown for valid address
      expect(walletInput).toHaveValue('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')
    })
  })

  describe('Form Submission', () => {
    const fillForm = async (user) => {
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      await user.type(screen.getByLabelText('Address 1'), '123 Main St')
      await user.type(screen.getByLabelText('City'), 'New York')
      await user.type(screen.getByLabelText('State'), 'NY')
      await user.type(screen.getByLabelText('Country'), 'USA')
      await user.type(screen.getByLabelText('Zipcode'), '10001')
    }

    it('should disable submit button when form is incomplete', () => {
      render(<MemberForm {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).toBeDisabled()
    })

    it('should enable submit button when all required fields are filled', async () => {
      const user = userEvent.setup()
      render(<MemberForm {...defaultProps} />)

      await fillForm(user)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).toBeEnabled()
    })

    it('should submit form with correct data', async () => {
      const user = userEvent.setup()
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ data: true }),
      })

      render(<MemberForm {...defaultProps} />)

      await fillForm(user)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/plr-dao-form',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: expect.stringContaining('John Doe'),
          })
        )
      })
    })

    it('should call onSubmitForm callback on successful submission', async () => {
      const user = userEvent.setup()
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ data: true }),
      })

      render(<MemberForm {...defaultProps} />)

      await fillForm(user)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmitForm).toHaveBeenCalled()
      })
    })

    it('should show error message on submission failure', async () => {
      const user = userEvent.setup()
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ data: null, message: 'Submission failed' }),
      })

      render(<MemberForm {...defaultProps} />)

      await fillForm(user)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Submission failed')).toBeInTheDocument()
      })
    })

    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup()
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      render(<MemberForm {...defaultProps} />)

      await fillForm(user)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Please try again.')).toBeInTheDocument()
      })
    })

    it('should disable submit button while submitting', async () => {
      const user = userEvent.setup()
      global.fetch.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ json: () => ({ data: true }) }), 100))
      )

      render(<MemberForm {...defaultProps} />)

      await fillForm(user)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      // Button should be disabled during submission
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Logout Functionality', () => {
    it('should call onLogout when logout button is clicked', async () => {
      const user = userEvent.setup()
      render(<MemberForm {...defaultProps} />)

      const logoutButton = screen.getByTitle('Logout and Restart')
      await user.click(logoutButton)

      expect(mockOnLogout).toHaveBeenCalled()
    })

    it('should disable logout button while form is submitting', async () => {
      const user = userEvent.setup()
      global.fetch.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ json: () => ({ data: true }) }), 100))
      )

      render(<MemberForm {...defaultProps} />)

      await user.type(screen.getByLabelText('Name'), 'John Doe')
      await user.type(screen.getByLabelText('Address 1'), '123 Main St')
      await user.type(screen.getByLabelText('City'), 'New York')
      await user.type(screen.getByLabelText('State'), 'NY')
      await user.type(screen.getByLabelText('Country'), 'USA')
      await user.type(screen.getByLabelText('Zipcode'), '10001')

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      const logoutButton = screen.getByTitle('Logout and Restart')
      expect(logoutButton).toBeDisabled()
    })
  })

  describe('Form Field Updates', () => {
    it('should update name field on input', async () => {
      const user = userEvent.setup()
      render(<MemberForm {...defaultProps} />)

      const nameInput = screen.getByLabelText('Name')
      await user.type(nameInput, 'Jane Smith')

      expect(nameInput).toHaveValue('Jane Smith')
    })

    it('should update all address fields on input', async () => {
      const user = userEvent.setup()
      render(<MemberForm {...defaultProps} />)

      await user.type(screen.getByLabelText('Address 1'), '456 Oak Ave')
      await user.type(screen.getByLabelText('Address 2'), 'Apt 2B')
      await user.type(screen.getByLabelText('City'), 'Boston')
      await user.type(screen.getByLabelText('State'), 'MA')
      await user.type(screen.getByLabelText('Country'), 'USA')
      await user.type(screen.getByLabelText('Zipcode'), '02101')

      expect(screen.getByLabelText('Address 1')).toHaveValue('456 Oak Ave')
      expect(screen.getByLabelText('Address 2')).toHaveValue('Apt 2B')
      expect(screen.getByLabelText('City')).toHaveValue('Boston')
      expect(screen.getByLabelText('State')).toHaveValue('MA')
      expect(screen.getByLabelText('Country')).toHaveValue('USA')
      expect(screen.getByLabelText('Zipcode')).toHaveValue('02101')
    })
  })
})
