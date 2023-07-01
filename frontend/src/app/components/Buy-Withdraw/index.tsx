import { Button, Form } from "antd";
import { ethers } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Charts from "../Charts/Charts";
import ChipCard from "../ChipCards";
import PriceCard from "../PriceCard";

import { messages, sections } from "../../../utils/constants";
import useFactory from "../../customHooks/useFactory";
import { selectCurrentTokenDetails } from "../../slice/factory/factory.selector";
import { resetFactory } from "../../slice/factory/factory.slice";

import "./index.scss";

export type props = {
  tab: string;
};

type FormData = {
  tokenA: string;
  tokenAAmount: number;
  tokenB: string;
  bondingCurveContract: string;
  tokenBAmount: string;
};

const BuyWithdraw = (props: props) => {
  const [form] = Form.useForm();
  const [slippageValue, setSlippageValue] = useState<string | number>("0%");
  const [loading, setLoading] = useState<boolean>(false);
  const { buyTokens, sellTokens } = useFactory();

  const selectedTokenDetails = useSelector(selectCurrentTokenDetails);

  const dispatch = useDispatch();

  const handleSlippageChange = useCallback((value: string | number) => {
    const formattedValue = typeof value === "number" ? `${value}%` : value;
    setSlippageValue(formattedValue);
  }, []);

  const validateFormValue = (formValues: FormData) => {
    return (
      !formValues.bondingCurveContract ||
      !formValues.tokenA ||
      !formValues.tokenAAmount ||
      !formValues.tokenB ||
      !formValues.tokenBAmount
    );
  };

  const onBuyOrWithdraw = useCallback(
    async (formValues: FormData) => {
      if (validateFormValue(formValues)) return;
      setLoading(true);
      const payload = {
        amount: ethers.utils.parseEther(formValues.tokenAAmount.toString()),
        estimatedPrice: ethers.utils.parseEther(
          formValues.tokenBAmount.toString()
        ),
        tokenA: formValues.tokenA,
        tokenB: formValues.tokenB,
        tokenManager: formValues.bondingCurveContract,
      };

      try {
        if (props.tab === sections.buy) {
          await buyTokens(payload);
        } else {
          await sellTokens(payload);
        }
        dispatch(resetFactory());
      } finally {
        setLoading(false);
      }
    },
    [props.tab, dispatch, buyTokens, sellTokens]
  );

  const { totalSupply, vestingPeriod } = useMemo(() => {
    return {
      totalSupply: ethers.utils.formatEther(
        selectedTokenDetails?.totalSupply ?? "0"
      ),
      vestingPeriod: (selectedTokenDetails?.vestingPeriod ?? "--") + " days",
    };
  }, [selectedTokenDetails?.totalSupply, selectedTokenDetails?.vestingPeriod]);

  return (
    <Form form={form} onFinish={onBuyOrWithdraw}>
      <div className="main">
        <div className="buy d-flex justify-content-center">
          <div className="buy-column-1">
            <PriceCard section={props.tab} transactionLoading={loading} />
          </div>
          <div className="buy-column-2">
            <div className="d-flex justify-content-center align-items-center w-100 h-100 m-0">
              <Charts tab={props.tab} />
            </div>
            <label>
              <span className="star">* </span>
              {props.tab === sections.buy
                ? messages.buyGraph
                : messages.withdrawGraph}
            </label>
          </div>
        </div>
        <div className="price-chips d-flex justify-content-center">
          <ChipCard title="TOTAL SUPPLY" value={totalSupply} />
          <ChipCard title="VESTING PERIOD" value={vestingPeriod} />
          <ChipCard
            title="SLIPPAGE TOLERANCE"
            value={slippageValue}
            handleSlippageChange={handleSlippageChange}
          />
        </div>
        <div className="d-flex justify-content-center">
          <Button
            className="buy-button"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            {props.tab === sections.buy ? "Buy Now" : "Withdraw"}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default BuyWithdraw;
