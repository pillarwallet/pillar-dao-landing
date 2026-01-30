import { useEffect, useRef } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";

//#region Styled
const Wrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 24px;
  background: rgba(43, 1, 64, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const Title = styled.h1`
  color: #78e8f6;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-family: "PTRootUIWebMedium", sans-serif;
`;
//#endregion Styled

const SignIn = ({ onWeb3ProviderSet, onConnectionSuccess }) => {
  const { connector, isConnected, address } = useAccount();
  const previousConnectionState = useRef(isConnected);

  console.log("wallet-connect: render", {
    isConnected,
    address,
    connector: connector?.name,
  });

  // Get provider from wagmi connector and notify parent on connection
  useEffect(() => {
    console.log("wallet-connect: useEffect triggered", {
      isConnected,
      address,
      connectorReady: connector?.ready,
      connectorName: connector?.name,
      previousState: previousConnectionState.current,
    });

    const handleConnection = async () => {
      if (!connector || !isConnected || !address) {
        console.log(
          "wallet-connect: skipping provider setup - no connector or not connected",
        );
        previousConnectionState.current = false;
        return;
      }

      console.log("wallet-connect: getting provider from connector");
      try {
        const provider = await connector.getProvider();
        console.log(
          "wallet-connect: provider obtained, calling onWeb3ProviderSet",
        );

        // Set the provider
        if (onWeb3ProviderSet) {
          onWeb3ProviderSet(provider);
        }

        // Notify parent of successful connection with wallet info
        // Only call this when transitioning from disconnected to connected
        if (!previousConnectionState.current && onConnectionSuccess) {
          console.log("wallet-connect: connection successful, notifying parent", {
            address,
            connector: connector.name,
          });
          onConnectionSuccess({
            address,
            connector: connector.name,
            provider,
          });
        }

        previousConnectionState.current = true;
      } catch (error) {
        console.error("wallet-connect: error getting provider", error);
        previousConnectionState.current = false;
      }
    };

    handleConnection();
  }, [connector, isConnected, address, onWeb3ProviderSet, onConnectionSuccess]);

  return (
    <Wrapper>
      <Title id="connect-wallet" style={{ scrollMarginTop: "100px" }}>
        Connect Wallet
      </Title>
      <ConnectKitButton />
    </Wrapper>
  );
};

export default SignIn;
