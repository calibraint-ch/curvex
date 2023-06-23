import { PayloadAction } from "@reduxjs/toolkit";
import { LaunchFormData } from "./constants";
import { call, put, takeLatest } from "redux-saga/effects";
import { uploadFileIpfs } from "./nftStorageService";
import { deployToken, setdeployTokenSuccess } from "./deploy.slice";
import { DeployParams } from "../../customHooks/constants";
import { ethers } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { responseMessages } from "../../../utils/constants";

export type DeploySagaPayload = PayloadAction<{
  formData: LaunchFormData;
  deployToken: (params: DeployParams) => TransactionResponse;
}>;

export function* deployTokenSaga({ payload }: DeploySagaPayload) {
  const { formData, deployToken } = payload;

  const { tokenName, tokenSymbol, curveType, curveParams, pairToken } =
    formData;

  const fileIpfsUrl: string = yield call(uploadFileIpfs, formData);

  const result: TransactionResponse = yield call(deployToken, {
    name: tokenName,
    symbol: tokenSymbol,
    logoURL: fileIpfsUrl,
    cap: (curveParams.totalSupply * 10) ^ 18,
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
    yield put(setdeployTokenSuccess(responseMessages.txnSuccess));
  } else {
    yield put(setdeployTokenSuccess(responseMessages.txnFailed));
  }
}

export function* callDeployTokenSaga() {
  yield takeLatest(deployToken, deployTokenSaga);
}
