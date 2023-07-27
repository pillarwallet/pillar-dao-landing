import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
const EMAIL_REGX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const WALLET_ADDRESS_REGX = /^0x[a-fA-F0-9]{40}$/;

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

const Label = styled.div`
  margin: 0.5rem 0.5px;
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

const PlrDaoForm = ({ defaultWalletAddress, onSubmitForm }) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [walletType, setWalletType] = useState('Wallet');
  const [address, setAddress] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasFormError, setFormError] = useState();

  useEffect(() => {
    setWalletAddress(defaultWalletAddress)
  }, [defaultWalletAddress]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const submitPayload = {
      Name: name,
      Email: email,
      WalletType: walletType,
      Address: address,
      WalletAddress: walletAddress,
    }

    try {
      const response = await fetch('/api/plr-dao-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitPayload),
      })
      const { data, message } = await response.json();
      if(data) {
        onSubmitForm();
        return
      }
      if(message){
        setFormError(message);
      }
    } catch(error) {
      setFormError('Please try again.')
    }
    setIsSubmitting(false);
  }

  const validateEmail = (email) => EMAIL_REGX.test(email);
  const validateWalletAddress = (address) => WALLET_ADDRESS_REGX.test(address);

  return (
    <FormContainer>
      <h3>PLR DAO Membership</h3>
      <div>
        <div>
          <Label>Name</Label>
          <Input type="text" id="first" name="first" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <Label>Postal Address</Label>
          <Input type="text" id="last" name="last" value={address} onChange={(event) => setAddress(event.target.value)} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="text" id="last" name="last" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          <Label>Wallet Address</Label>
          <Input type="text" id="last" name="last" value={walletAddress} onChange={(event) => setWalletAddress(event.target.value)} />
        </div>
        <RadioButtonWrapper>
          <RadioButton>
            <input
              type="radio"
              name="Wallet"
              value="Wallet"
              checked={walletType === 'Wallet'}
              onChange={(event) => setWalletType(event.target.value)}
            />
            Wallet
          </RadioButton>
          <RadioButton>
            <input
              type="radio"
              name="Smart Wallet"
              value="Smart Wallet"
              checked={walletType === 'Smart Wallet'}
              onChange={(event) => setWalletType(event.target.value)}
            />
            Smart Wallet
          </RadioButton>
        </RadioButtonWrapper>
        {hasFormError &&
          (<Error>
            {hasFormError}
          </Error>
          )}
        <SubmitButton
          disabled={isSubmitting || !name || !address || !walletType || !email || !address || !validateEmail(email) || !validateWalletAddress(walletAddress)} onClick={handleSubmit}>Submit</SubmitButton>
      </div>
    </FormContainer>
  );
};

export default PlrDaoForm;