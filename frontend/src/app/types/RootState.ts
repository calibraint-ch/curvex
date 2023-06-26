import { FactoryState } from "../slice/factory/factory.slice";
import { WalletState } from "../slice/wallet.slice";

export interface RootState {
  wallet: WalletState;
  factory: FactoryState;
}
