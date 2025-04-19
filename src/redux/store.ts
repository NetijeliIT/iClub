import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import cardReducer from "./card-slice";


export const store = configureStore({
    reducer: {
        card: cardReducer,
        auth: authReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch