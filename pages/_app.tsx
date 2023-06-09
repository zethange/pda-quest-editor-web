import "@/styles/globals.css";
import "@/styles/node.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import store from "@/store/reduxStore";
import AuthProvider from "@/store/utils/providers/AuthProvider";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const AnyComponent = Component as any;
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <AuthProvider>
          <Provider store={store}>
            <AnyComponent {...pageProps} />
          </Provider>
        </AuthProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}
