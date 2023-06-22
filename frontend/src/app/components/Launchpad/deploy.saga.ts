import { PayloadAction } from "@reduxjs/toolkit";
import { LaunchFormData } from "./constants";
import { call, takeLatest } from "redux-saga/effects";
import { uploadFileIpfs } from "./nftStorageService";
import { deployToken } from "./deploy.slice";
import { DeployParams } from "../../customHooks/constants";

export type DeploySagaPayload = PayloadAction<{
  formData: LaunchFormData;
  deployToken: DeployParams;
}>;

export function* deployTokenSaga({ payload }: DeploySagaPayload): any {
  const { formData, deployToken } = payload;

  const fileIpfsUrl = yield call(uploadFileIpfs, formData);
}

export function* callDeployTokenSaga() {
  yield takeLatest(deployToken, deployTokenSaga);
}
