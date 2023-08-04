import "@/styles/globals.css";
import "@/styles/node.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import store from "@/store/reduxStore";
import AuthProvider from "@/components/Providers/AuthProvider";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const AnyComponent = Component as any;
  return (
    <ChakraProvider>
      <Provider store={store}>
        <AuthProvider>
          <AnyComponent {...pageProps} />
        </AuthProvider>
      </Provider>
    </ChakraProvider>
  );
}
