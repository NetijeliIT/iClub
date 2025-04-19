import React from "react";
import { store } from "./store";
import { Provider } from "react-redux";
// import setup from "@/services/setupInterceptor";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

// setup(store)