import "@/styles/globals.css";
import "@/styles/node.css";

import * as React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./providers/router/router";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "@/store/reduxStore";
import WithCoop from "./providers/with-coop/with-coop";
import { AuthProvider } from "./providers/auth/auth-provider";

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <AuthProvider>
          <WithCoop>
            <RouterProvider router={router} />
          </WithCoop>
        </AuthProvider>
      </Provider>
    </ChakraProvider>
  );
};

export default App;
