import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useInjectReducer, useInjectSaga } from "redux-injectors";
import { LaunchFormData } from "./constants";
import { callDeployTokenSaga } from "./deploy.saga";

export type DeployTokenState = {
  deployToken: {
    isLoading: boolean;
    success: {
      message: string;
    };
    error: {
      message: string;
    };
  };
};

export const deployTokenInitialState: DeployTokenState = {
  deployToken: {
    isLoading: false,
    success: {
      message: "",
    },
    error: {
      message: "",
    },
  },
};

export const deployTokenSlice = createSlice({
  name: "deployToken",
  initialState: deployTokenInitialState,
  reducers: {
    deployToken: (
      state,
      _action: PayloadAction<{
        formData: LaunchFormData;
        deployToken: any;
      }>
    ) => {
      state.deployToken.isLoading = true;
    },
    setDeployTokenSuccess: (state, action: PayloadAction<string>) => {
      state.deployToken.success.message = action.payload;
    },
    setDeployTokenError: (state, action: PayloadAction<string>) => {
      state.deployToken.error.message = action.payload;
    },
  },
});

export const { deployToken, setDeployTokenError, setDeployTokenSuccess } =
  deployTokenSlice.actions;

export const deployTokenReducer = deployTokenSlice.reducer;

export const useDeployTokenSlice = () => {
  useInjectReducer({
    key: deployTokenSlice.name,
    reducer: deployTokenReducer,
  });
  useInjectSaga({ key: deployTokenSlice.name, saga: callDeployTokenSaga });
};
