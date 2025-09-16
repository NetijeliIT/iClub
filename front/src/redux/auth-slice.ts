import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
    isLogged: boolean;
    data: any | null;
    isLoading: boolean;
};

const initialState: InitialState = {
    isLogged: false,
    data: null,
    isLoading: true,
};

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<any>) => {
            localStorage.setItem("accessToken", action.payload.accessToken);
            return {
                ...state,
                isLogged: true,
                data: action.payload,
                isLoading: false,
            };
        },
        logout: (state) => {
            localStorage.removeItem("accessToken");
            return {
                ...state,
                isLogged: false,
                data: null,
                isLoading: false,
            };
        },
        register: (state, action: PayloadAction<any>) => {
            localStorage.setItem("accessToken", action.payload.accessToken);
            return {
                ...state,
                isLogged: true,
                data: action.payload,
                isLoading: false,
            };
        },
        initializeAuth: (state) => {
            const savedToken = localStorage.getItem("accessToken");
            if (savedToken) {
                return {
                    ...state,
                    isLogged: true,
                    data: savedToken,
                    isLoading: false,
                };
            }
            return {
                ...state,
                isLoading: false,
            };
        },
    },
});

export const { login, logout, register, initializeAuth } = auth.actions;
export default auth.reducer;