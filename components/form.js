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
  margin: 0.875rem 0rem;
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

const PlrDaoForm = ({ onSubmitForm }) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [walletType, setWalletType] = useState('Wallet');
  const [address, setAddress] = useState();

  useEffect(() => {
    getNotionData();
  }, [])

  const getNotionData = async (data) => {
    try {
      console.log("success");
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      Name: name,
      Email: email,
      Wallet: walletType,
      Address: address,
    }

    const response = await fetch('/api/plr-dao-form', {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    await response.json();
    onSubmitForm();
  }

  const validateEmail = (email) => EMAIL_REGX.test(email);
  const validateWalletAddress = (address) => WALLET_ADDRESS_REGX.test(address);

  return (
    <FormContainer>
      <h3>PLR DAO Membership</h3>
      <div>
        <div>
          <Label>Name</Label>
          <Input type="text" id="first" name="first" onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <Label>Address</Label>
          <Input type="text" id="last" name="last" onChange={(event) => setAddress(event.target.value)} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="text" id="last" name="last" onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          <Label>Wallet</Label>
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
        </div>
        <SubmitButton
          disabled={!name || !address || !walletType || !email || !validateEmail(email) || !validateWalletAddress(address)} onClick={handleSubmit}>Submit</SubmitButton>
      </div>
    </FormContainer>
  );
};

export default PlrDaoForm;