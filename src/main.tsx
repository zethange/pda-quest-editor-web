import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "@/store/reduxStore";
import AuthProvider from "@/components/Providers/AuthProvider";
import AppRouter from "@/app/router";
import "@/styles/globals.css";
import "@/styles/node.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
