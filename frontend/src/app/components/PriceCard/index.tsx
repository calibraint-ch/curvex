import { Form, Input } from "antd";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  priceCardItems,
  sections,
  tokenInputPlaceholders,
} from "../../../utils/constants";
import { formatBalance, formatEtherBalance } from "../../../utils/methods";
import useErc20 from "../../customHooks/useErc20";
import useFactory from "../../customHooks/useFactory";
import {
  selectFactoryLoaded,
  selectFactoryLoading,
} from "../../slice/factory/factory.selector";
import { selectWallet } from "../../slice/wallet.selector";
import DropDown from "../Dropdown";
import PriceInput from "../PriceInput";
import {
  AllTokenDetails,
  TokenPairDropdown,
  getEstimationByCurveType,
  splitTokenPair,
} from "./service";

import "./index.scss";

type SectionProps = {
  section: string;
  transactionLoading: boolean;
};

const PriceCard = (props: SectionProps) => {
  const { section, transactionLoading } = props;

  const form = useFormInstance();
  const { deployedTokenList } = useFactory();
  const { getContractInstance } = useErc20();

  const [{ tokenListA = [], tokenListB = [] }, setTokens] =
    useState<TokenPairDropdown>({ tokenListA: [], tokenListB: [] });

  const [tokensLoading, setTokensLoading] = useState(true);
  const [allTokensDetails, setAllTokensDetails] = useState<AllTokenDetails>(
    new Map()
  );

  const walletAddress = useSelector(selectWallet);
  const factoryLoaded = useSelector(selectFactoryLoaded);
  const factoryLoading = useSelector(selectFactoryLoading);

  const cardAToken = Form.useWatch(priceCardItems.tokenA);
  const cardBToken = Form.useWatch(priceCardItems.tokenB);
  const cardATokenAmount = Form.useWatch(priceCardItems.tokenAAmount);

  const isBuy = section === sections.buy;

  const fetchTokens = useCallback(async () => {
    setTokensLoading(true);
    const contract = await getContractInstance(
      ethers.constants.AddressZero,
      true
    );
    if (contract) {
      const { tokens, allTokenDetails } = await splitTokenPair(
        deployedTokenList,
        contract,
        walletAddress
      );
      setTokens(tokens);
      setTokensLoading(false);
      setAllTokensDetails(allTokenDetails);
    }
  }, [deployedTokenList, getContractInstance, walletAddress]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  useEffect(() => {
    if (!cardAToken && tokenListA.length)
      form.setFieldValue(priceCardItems.tokenA, tokenListA[0].value);

    if (!cardBToken && tokenListB.length)
      form.setFieldValue(priceCardItems.tokenB, tokenListB[0].value);

    form.setFieldValue(
      priceCardItems.bondingCurveContract,
      allTokensDetails.get(cardAToken)?.manager
    );
  }, [allTokensDetails, cardAToken, cardBToken, form, tokenListA, tokenListB]);

  const balance = useMemo(
    () => allTokensDetails.get(cardAToken)?.balance,
    [allTokensDetails, cardAToken]
  );

  const tokenBBalance = useMemo(
    () => allTokensDetails.get(cardBToken)?.balance,
    [allTokensDetails, cardBToken]
  );

  const estimation = useMemo(() => {
    const tokenADetails = allTokensDetails.get(cardAToken);

    if (!tokenADetails || !cardATokenAmount) {
      return 0;
    }
    const value = getEstimationByCurveType(
      tokenADetails,
      ethers.utils.parseEther(cardATokenAmount.toString()),
      isBuy
    );
    return value
      ? Number(formatEtherBalance(value, tokenADetails.decimals))
      : 0;
  }, [allTokensDetails, cardAToken, cardATokenAmount, isBuy]);

  useEffect(() => {
    form.setFieldValue(priceCardItems.tokenBAmount, estimation);
  }, [estimation, form]);

  return (
    <div className="price-card-group">
      <div>
        <div className="price-card">
          <div className="d-flex justify-content-between">
            <DropDown
              name={priceCardItems.tokenA}
              options={tokenListA}
              placeholder={tokenInputPlaceholders}
              loading={tokensLoading || !factoryLoaded || factoryLoading}
              disabled={transactionLoading}
            />
            <p className="balance-text">
              BALANCE: <span>{formatBalance(balance?.toString())}</span>
            </p>
          </div>
          {/* this is an auto modified value and not shown in UI */}
          <Form.Item name={priceCardItems.bondingCurveContract} noStyle>
            <Input type="hidden"></Input>
          </Form.Item>
          <Form.Item name={priceCardItems.tokenAAmount}>
            <PriceInput disabled={transactionLoading} />
          </Form.Item>
        </div>
      </div>
      <div className="price-card">
        <div className="d-flex justify-content-between">
          <DropDown
            name={priceCardItems.tokenB}
            options={tokenListB}
            placeholder={tokenInputPlaceholders}
            loading={tokensLoading || !factoryLoaded || factoryLoading}
            disabled={transactionLoading}
          />
          <p className="balance-text">
            BALANCE: <span>{formatBalance(tokenBBalance?.toString())}</span>
          </p>
        </div>
        <Form.Item name={priceCardItems.tokenBAmount}>
          <PriceInput disabled value={estimation} />
        </Form.Item>
      </div>
    </div>
  );
};

export default PriceCard;
