export const formatWalletAddress = (
  walletAddress: string | null | undefined
) => {
  if (walletAddress) {
    return `${walletAddress?.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }

  return "";
};

export const formatBalance = (balance?: string) => {
  if (!balance) return "--";
  return Number(balance).toFixed(4);
};
