import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IoLogOutOutline } from 'react-icons/io5';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const WALLET_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

//#region Styled
const FormContainer = styled.div`
  width: 100%;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 1rem 0.813rem;
  border-radius: 0.75rem;
  border: solid 1px #49437d;
  font-family: 'PTRootUIWebMedium', sans-serif;
  font-size: 1rem;
  color: #fff;
  background-color: #1a1726;
  width: 100%;

  &::placeholder {
    color: #78e8f6;
  }

  &:focus {
    outline: #78e8f6 solid 1px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }
`;

const SubmitButton = styled.button`
  cursor: pointer;
  margin: 1rem 0rem;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px 0 rgba(95, 0, 1, 0.13);
  border: none;
  background: #890df8;
  font-family: 'PTRootUIWebRegular', sans-serif;
  text-align: center;
  color: #fff;
  font-size: 1.25rem;
  width: 100%;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const RestartButton = styled.button`
  cursor: pointer;
  margin: 0.5rem;
  padding: 0.5rem 0.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px 0 rgba(95, 0, 1, 0.13);
  border: none;
  background: #890df8;
  font-family: 'PTRootUIWebRegular', sans-serif;
  text-align: center;
  color: #fff;
  font-size: 1rem;
  width: 100%;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  margin-right: 10px;
`;

const Title = styled.h3`
  margin: 0;
`;

const Label = styled.label`
  margin: 0.5rem 0.5px;
  display: block;
  cursor: pointer;
`;

const FormField = styled.div`
  margin-bottom: 1rem;
`;

const RadioButton = styled.label`
  margin: 0.5rem 0.5px;
`;

const RadioButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled.div`
  margin: 1rem 0rem 0.5rem 0rem;
  color: red;
`;

const FormError = styled.div`
  color: red;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;
//#endregion Styled

const PlrDaoForm = ({ connector, defaultWalletAddress, defaultEmail, onLogout, onSubmitForm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [walletType, setWalletType] = useState('Wallet');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasFormError, setFormError] = useState();

  useEffect(() => {
    if (defaultWalletAddress) {
      setWalletAddress(defaultWalletAddress);
    }
    if (defaultEmail) {
      setEmail(defaultEmail);
      isEmailValid(defaultEmail);
    }
  }, [defaultWalletAddress, defaultEmail]);

  const isEmailValid = (emailValue) => {
    const isValid = EMAIL_REGEX.test(emailValue);
    return emailValue?.length && isValid;
  };

  const isWalletAddressValid = (address) => WALLET_ADDRESS_REGEX.test(address);

  const isFormNotValid = () => {
    return (
      isSubmitting ||
      !name ||
      !address1 ||
      !city ||
      !state ||
      !country ||
      !zipcode ||
      !walletType ||
      !isEmailValid(email) ||
      !isWalletAddressValid(walletAddress)
    );
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    if (emailTouched) {
      setShowEmailError(newEmail.length > 0 && !isEmailValid(newEmail));
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setShowEmailError(email.length > 0 && !isEmailValid(email));
  };

  const handleSubmit = async () => {
    if (isFormNotValid()) {
      return;
    }
    setIsSubmitting(true);
    const submitPayload = {
      name,
      email,
      address1,
      address2,
      city,
      state,
      country,
      zipcode,
      walletType,
      walletAddress,
    };

    try {
      const response = await fetch('/api/plr-dao-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitPayload),
      });
      console.log('API Response:', response);
      
      if (!response.ok) {
        const err = new Error(`HTTP error! status: ${response.status}`);
        throw err;
      }
      
      // Check if the response has content before trying to parse JSON
      const text = await response.text();
      if (!text) {
        const err = new Error('Empty response from server');
        throw err;
      }
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response text:', text);
        const err = new Error('Invalid JSON response from server');
        throw err;
      }
      
      const { data, message } = parsedResponse;
      console.log('Parsed Response:', { data, message });
      
      if (data) {
        onSubmitForm();
        return;
      }
      if (message) {
        setFormError(message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      let userMessage = 'Failed to save form data to database. Please verify your input and try again.';
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        userMessage = 'Unable to connect to the server. Please make sure the development server is running on port 3001 and try again.';
      } else if (error.message && error.message.includes('NetworkError')) {
        userMessage = 'Network error occurred. Please check your connection and try again.';
      }
      
      setFormError(userMessage);
    }
    setIsSubmitting(false);
  };

  return (
    <FormContainer>
      <HeaderWrapper>
        <Title>PLR DAO Membership</Title>
        <div>
          <RestartButton title="Logout and Restart" disabled={isSubmitting} onClick={onLogout}>
            <IoLogOutOutline />
          </RestartButton>
        </div>
      </HeaderWrapper>
      <div>
        <FormField>
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </FormField>

        <FormField>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={handleEmailChange} onBlur={handleEmailBlur} />
          {showEmailError && <FormError>Please enter a valid email address</FormError>}
        </FormField>

        <FormField>
          <Label htmlFor="address1">Address 1</Label>
          <Input id="address1" type="text" value={address1} onChange={(event) => setAddress1(event.target.value)} />
        </FormField>

        <FormField>
          <Label htmlFor="address2">Address 2</Label>
          <Input id="address2" type="text" value={address2} onChange={(event) => setAddress2(event.target.value)} />
        </FormField>

        <FormField>
          <Label htmlFor="city">City</Label>
          <Input id="city" type="text" value={city} onChange={(event) => setCity(event.target.value)} />
        </FormField>

        <FormField>
          <Label htmlFor="state">State</Label>
          <Input id="state" type="text" value={state} onChange={(event) => setState(event.target.value)} />
        </FormField>

        <FormField>
          <Label htmlFor="country">Country</Label>
          <Input id="country" type="text" value={country} onChange={(event) => setCountry(event.target.value)} />
        </FormField>

        <FormField>
          <Label htmlFor="zipcode">Zipcode</Label>
          <Input id="zipcode" type="text" value={zipcode} onChange={(event) => setZipcode(event.target.value)} />
        </FormField>

        {connector && (
          <FormField>
            <Label>{connector?.name}</Label>
          </FormField>
        )}

        <FormField>
          <Label htmlFor="walletAddress">Wallet Address</Label>
          <Input
            id="walletAddress"
            disabled={!!connector && walletAddress?.length}
            type="text"
            value={walletAddress}
            onChange={(event) => setWalletAddress(event.target.value)}
          />
        </FormField>

        <RadioButtonWrapper>
          <RadioButton style={{ display: 'none' }}>
            <input
              type="radio"
              name="Wallet"
              value="Wallet"
              checked={walletType === 'Wallet'}
              onChange={(event) => setWalletType(event.target.value)}
            />
            Wallet
          </RadioButton>
        </RadioButtonWrapper>

        {hasFormError && <ErrorMessage>{hasFormError}</ErrorMessage>}

        <SubmitButton disabled={isFormNotValid()} onClick={handleSubmit}>
          Submit
        </SubmitButton>
      </div>
    </FormContainer>
  );
};

export default PlrDaoForm;
