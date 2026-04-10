import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import type { ReactNode } from "react";
import store from "@/store/reduxStore";
import AuthProvider from "@/components/Providers/AuthProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ChakraProvider>
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </AuthProvider>
      </Provider>
    </ChakraProvider>
  );
}
