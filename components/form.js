import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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

const Label = styled.div`
  margin: 0.5rem 0.5px;
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

const Error = styled.div`
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
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [emailTouched, setEmailTouched] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [address1, setAddress1] = useState();
  const [address2, setAddress2] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [zipcode, setZipcode] = useState();
  const [walletType, setWalletType] = useState('Wallet');
  const [walletAddress, setWalletAddress] = useState();
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
    return emailValue.length > 0 && isValid;
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
      console.error('Form is not valid');
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
      const { data, message } = await response.json();
      if (data) {
        onSubmitForm();
        return;
      }
      if (message) {
        setFormError(message);
      }
    } catch (error) {
      setFormError('Please try again.');
      console.error('Form error', error);
    }
    setIsSubmitting(false);
  };

  return (
    <FormContainer>
      <HeaderWrapper>
        <Title>PLR DAO Membership</Title>
        <div>
          <RestartButton title="Logout and Restart" disabled={isSubmitting} onClick={onLogout}>
            ⟳
          </RestartButton>
        </div>
      </HeaderWrapper>
      <div>
        <FormField>
          <Label>Name</Label>
          <Input type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </FormField>

        <FormField>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={handleEmailChange} onBlur={handleEmailBlur} />
          {showEmailError && <FormError>Please enter a valid email address</FormError>}
        </FormField>

        <FormField>
          <Label>Address 1</Label>
          <Input type="text" value={address1} onChange={(event) => setAddress1(event.target.value)} />
        </FormField>

        <FormField>
          <Label>Address 2</Label>
          <Input type="text" value={address2} onChange={(event) => setAddress2(event.target.value)} />
        </FormField>

        <FormField>
          <Label>City</Label>
          <Input type="text" value={city} onChange={(event) => setCity(event.target.value)} />
        </FormField>

        <FormField>
          <Label>State</Label>
          <Input type="text" value={state} onChange={(event) => setState(event.target.value)} />
        </FormField>

        <FormField>
          <Label>Country</Label>
          <Input type="text" value={country} onChange={(event) => setCountry(event.target.value)} />
        </FormField>

        <FormField>
          <Label>Zipcode</Label>
          <Input type="text" value={zipcode} onChange={(event) => setZipcode(event.target.value)} />
        </FormField>

        {connector && (
          <FormField>
            <Label>{connector?.name}</Label>
          </FormField>
        )}

        <FormField>
          <Label>Wallet Address</Label>
          <Input
            disabled={!!connector && walletAddress?.length}
            type="text"
            id="last"
            name="last"
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

        {hasFormError && <Error>{hasFormError}</Error>}

        <SubmitButton disabled={isFormNotValid()} onClick={handleSubmit}>
          Submit
        </SubmitButton>
      </div>
    </FormContainer>
  );
};

export default PlrDaoForm;
