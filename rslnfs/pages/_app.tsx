import '../styles/globals.css';
import type { AppProps } from "next/app";
import '../data/i18n';
import { useEffect, useState } from 'react';
import AnimatedBackground from '../components/AnimatedBackground';

export default function App({ Component, pageProps, router }: AppProps & { router?: any }) {
  // إظهار الخلفية المتغيرة فقط في الصفحة الرئيسية
  const isHome = (router?.pathname ?? typeof window !== 'undefined' && window.location.pathname) === '/' || (typeof window !== 'undefined' && window.location.pathname === '/');
  return <>
    {isHome && <AnimatedBackground />}
    <Component {...pageProps} />
  </>;
}
