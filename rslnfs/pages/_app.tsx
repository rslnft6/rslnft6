import '../styles/globals.css';
import type { AppProps } from "next/app";
import '../data/i18n';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
