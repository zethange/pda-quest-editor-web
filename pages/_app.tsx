import "@/styles/globals.css";
import "@/styles/node.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import store from "@/store/reduxStore";
import AuthProvider from "@/components/Providers/AuthProvider";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const AnyComponent = Component as any;
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Provider store={store}>
          <AuthProvider>
            <AnyComponent {...pageProps} />
          </AuthProvider>
        </Provider>
      </ChakraProvider>
    </SessionProvider>
  );
}
