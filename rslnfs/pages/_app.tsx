import '../styles/globals.css';
import type { AppProps } from "next/app";
import '../data/i18n';
import { useEffect, useState } from 'react';

function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    });
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => {
      deferredPrompt.prompt();
      setShow(false);
    }} style={{position:'fixed',bottom:24,left:24,zIndex:9999,background:'#00bcd4',color:'#fff',border:'none',borderRadius:12,padding:'12px 32px',fontWeight:'bold',boxShadow:'0 2px 16px #00bcd4'}}>تثبيت التطبيق</button>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <InstallPWAButton />
    <Component {...pageProps} />
  </>;
}
