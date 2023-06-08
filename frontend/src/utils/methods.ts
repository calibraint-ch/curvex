export const formatWalletAddress = (
  walletAddress: string | null | undefined
) => {
  if (walletAddress) {
    return `${walletAddress?.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }

  return "";
};
