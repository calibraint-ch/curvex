import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../types/RootState";
import { deployTokenInitialState } from "./deploy.slice";

const stateValue = (state: RootState) =>
  state?.deployToken || deployTokenInitialState;

export const selectTokenSuccess = createSelector([stateValue], (state) => {
  return state.deployToken.success.message;
});

export const selectTokenError = createSelector([stateValue], (state) => {
  return state.deployToken.error.message;
});

export const selectLoading = createSelector([stateValue], (state) => {
  return state.deployToken.isLoading;
});
