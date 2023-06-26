import { Form } from "antd";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  priceCardItems,
  sections,
  tokenInputPlaceholders,
} from "../../../utils/constants";
import { formatBalance } from "../../../utils/methods";
import useErc20 from "../../customHooks/useErc20";
import useFactory from "../../customHooks/useFactory";
import useMetamaskProvider from "../../customHooks/useMetamaskProvider";
import { selectWallet } from "../../slice/wallet.selector";
import DropDown from "../Dropdown";
import PriceInput from "../PriceInput";
import { TokenPairDropdown, splitTokenPair } from "./service";

import "./index.scss";

type SectionProps = {
  section: string;
};

const PriceCard = (props: SectionProps) => {
  const { balance } = useMetamaskProvider();
  const { deployedTokenList } = useFactory();
  const { getContractInstance } = useErc20();
  const [tokens, setTokens] = useState<TokenPairDropdown>({
    tokenListA: [],
    tokenListB: [],
  });
  const [tokensLoading, setTokensLoading] = useState(true);

  const walletAddress = useSelector(selectWallet);

  const form = useFormInstance();

  const cardAToken = Form.useWatch(priceCardItems.tokenA);
  const cardBToken = Form.useWatch(priceCardItems.tokenB);

  const { section } = props;
  const { buy } = sections;

  const isBuy = section === buy;

  const { tokenListA = [], tokenListB = [] } = useMemo(
    () =>
      isBuy
        ? { tokenListA: tokens.tokenListB, tokenListB: tokens.tokenListA }
        : tokens,
    [isBuy, tokens]
  );

  const fetchTokens = useCallback(async () => {
    setTokensLoading(true);
    const { tokens } = await splitTokenPair(
      deployedTokenList,
      await getContractInstance(ethers.constants.AddressZero, true),
      walletAddress
    );
    setTokens(tokens);
    setTokensLoading(false);
  }, [deployedTokenList, getContractInstance, walletAddress]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  useEffect(() => {
    if (!cardAToken && tokenListA.length)
      form.setFieldValue(priceCardItems.tokenA, tokenListA[0].value);

    if (!cardBToken && tokenListB.length)
      form.setFieldValue(priceCardItems.tokenB, tokenListB[0].value);
  }, [cardAToken, cardBToken, form, tokenListA, tokenListB]);

  return (
    <div className="price-card-group">
      <div>
        <div className="price-card">
          <div className="d-flex justify-content-between">
            <DropDown
              name={priceCardItems.tokenA}
              options={tokenListA}
              placeholder={tokenInputPlaceholders}
              loading={tokensLoading}
            />
            <p className="balance-text">
              BALANCE: <span>{formatBalance(balance)}</span>
            </p>
          </div>
          <Form.Item name={priceCardItems.tokenAAmount}>
            <PriceInput />
          </Form.Item>
        </div>
      </div>
      <div className="price-card">
        <DropDown
          name={priceCardItems.tokenB}
          options={tokenListB}
          placeholder={tokenInputPlaceholders}
          loading={tokensLoading}
        />
        <Form.Item name={priceCardItems.tokenBAmount}>
          <PriceInput disabled />
        </Form.Item>
      </div>
    </div>
  );
};

export default PriceCard;
