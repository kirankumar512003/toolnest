import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
