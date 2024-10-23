import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
const EMAIL_REGX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const WALLET_ADDRESS_REGX = /^0x[a-fA-F0-9]{40}$/;

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
//#endregion Styled

const PlrDaoForm = ({ defaultWalletAddress, defaultEmail, onSubmitForm }) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
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
    setWalletAddress(defaultWalletAddress);
    setEmail(defaultEmail);
  }, [defaultWalletAddress, defaultEmail]);

  const handleSubmit = async () => {
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
    }
    setIsSubmitting(false);
  };

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
          <Label>Email</Label>
          <Input type="text" id="last" name="last" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          <Label>Address 1</Label>
          <Input
            type="text"
            id="last"
            name="last"
            value={address1}
            onChange={(event) => setAddress1(event.target.value)}
          />
        </div>
        <div>
          <Label>Address 2</Label>
          <Input
            type="text"
            id="last"
            name="last"
            value={address2}
            onChange={(event) => setAddress2(event.target.value)}
          />
        </div>
        <div>
          <Label>City</Label>
          <Input type="text" id="last" name="last" value={city} onChange={(event) => setCity(event.target.value)} />
        </div>
        <div>
          <Label>State</Label>
          <Input type="text" id="last" name="last" value={state} onChange={(event) => setState(event.target.value)} />
        </div>
        <div>
          <Label>Country</Label>
          <Input
            type="text"
            id="last"
            name="last"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          />
        </div>
        <div>
          <Label>Zipcode</Label>
          <Input
            type="text"
            id="last"
            name="last"
            value={zipcode}
            onChange={(event) => setZipcode(event.target.value)}
          />
        </div>
        <div>
          <Label>Wallet Address</Label>
          <Input
            type="text"
            id="last"
            name="last"
            value={walletAddress}
            onChange={(event) => setWalletAddress(event.target.value)}
          />
        </div>
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
        <SubmitButton
          disabled={
            isSubmitting ||
            !name ||
            !address1 ||
            !city ||
            !state ||
            !country ||
            !zipcode ||
            !walletType ||
            !email ||
            !validateEmail(email) ||
            !validateWalletAddress(walletAddress)
          }
          onClick={handleSubmit}
        >
          Submit
        </SubmitButton>
      </div>
    </FormContainer>
  );
};

export default PlrDaoForm;
