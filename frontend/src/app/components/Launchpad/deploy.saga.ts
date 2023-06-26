import { TransactionResponse } from "@ethersproject/abstract-provider";
import { PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { call, put, takeLatest } from "redux-saga/effects";

import { responseMessages } from "../../../utils/constants";
import { DeployParams } from "../../customHooks/constants";
import { LaunchFormData } from "./constants";
import {
  deployToken,
  setDeployTokenError,
  setDeployTokenSuccess,
} from "./deploy.slice";
import { uploadFileIpfs } from "./nftStorageService";
import { message } from "antd";

export type DeploySagaPayload = PayloadAction<{
  formData: LaunchFormData;
  deployToken: (params: DeployParams) => TransactionResponse;
}>;

export function* deployTokenSaga({ payload }: DeploySagaPayload) {
  try {
    const { formData, deployToken } = payload;

    const { tokenName, tokenSymbol, curveType, curveParams, pairToken } =
      formData;

    const fileIpfsUrl: string = yield call(uploadFileIpfs, formData);

    const result: TransactionResponse = yield call(deployToken, {
      name: tokenName,
      symbol: tokenSymbol,
      logoURL: fileIpfsUrl,
      cap: ethers.utils.parseEther(curveParams.totalSupply.toString()),
      lockPeriod: curveParams.lockPeriod,
      precision: curveParams.precision,
      curveType: curveType,
      pairToken: pairToken,
      salt: ethers.utils.solidityKeccak256(
        ["uint256"],
        [Math.floor(Math.random() * 1000000000)]
      ),
    });

    if (result.hash) {
      yield put(setDeployTokenSuccess(responseMessages.txnSuccess));
    }
  } catch (err: any) {
    const code = err?.code;
    if (code === 4001 || code === "ACTION_REJECTED") {
      yield put(setDeployTokenError(responseMessages.txnRejected));
    } else {
      yield put(setDeployTokenError(responseMessages.txnUnsuccessful));
    }
  }
}

export function* callDeployTokenSaga() {
  yield takeLatest(deployToken, deployTokenSaga);
}
