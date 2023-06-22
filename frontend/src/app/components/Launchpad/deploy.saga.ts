import { PayloadAction } from "@reduxjs/toolkit";
import { LaunchFormData } from "./constants";
import { call, takeLatest } from "redux-saga/effects";
import { uploadFileIpfs } from "./nftStorageService";
import { deployToken } from "./deploy.slice";
import { DeployParams } from "../../customHooks/constants";
import { ethers } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";

export type DeploySagaPayload = PayloadAction<{
  formData: LaunchFormData;
  deployToken: (params: DeployParams) => TransactionResponse;
}>;

export function* deployTokenSaga({ payload }: DeploySagaPayload) {
  const { formData, deployToken } = payload;

  const { tokenName, tokenSymbol, curveType, curveParams, tokenManager } =
    formData;

  const fileIpfsUrl: string = yield call(uploadFileIpfs, formData);

  console.log("FileIPfsUrl", fileIpfsUrl);

  const result: TransactionResponse = yield call(deployToken, {
    name: tokenName,
    symbol: tokenSymbol,
    logoURL: fileIpfsUrl,
    cap: curveParams.totalSupply,
    lockPeriod: curveParams.lockPeriod,
    precision: curveParams.precision,
    curveType: curveType,
    pairToken: tokenManager,
    salt: ethers.utils.solidityKeccak256(
      ["uint256"],
      [Math.floor(Math.random() * 1000000000)]
    ),
  });

  console.log(result);
}

export function* callDeployTokenSaga() {
  yield takeLatest(deployToken, deployTokenSaga);
}
