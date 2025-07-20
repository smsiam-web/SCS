import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../app/layout";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <Layout>
          <Notifications position="top-right" autoClose={2000} />
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </Provider>
  );
}
