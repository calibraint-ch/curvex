import "dotenv";

const walletPrivateAddress: string = process.env.WALLET_PRIVATE_KEY ?? "";

if (!walletPrivateAddress) {
  throw new Error("Wallet private key is empty");
}

export const environment = {
  walletPrivateAddress,
};
