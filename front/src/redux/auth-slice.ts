import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
    isLogged: boolean;
    token: string | null;
    isLoading: boolean;
};

const initialState: InitialState = {
    isLogged: false,
    token: null,
    isLoading: true,
};

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            localStorage.setItem("accessToken", action.payload);
            return {
                ...state,
                isLogged: true,
                token: action.payload,
                isLoading: false,
            };
        },
        logout: (state) => {
            localStorage.removeItem("accessToken");
            return {
                ...state,
                isLogged: false,
                token: null,
                isLoading: false,
            };
        },
        register: (state, action: PayloadAction<string>) => {
            localStorage.setItem("token", action.payload);
            return {
                ...state,
                isLogged: true,
                token: action.payload,
                isLoading: false,
            };
        },
        initializeAuth: (state) => {
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                return {
                    ...state,
                    isLogged: true,
                    token: savedToken,
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