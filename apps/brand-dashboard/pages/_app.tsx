import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token && router.pathname !== "/login") {
      router.replace("/login");
    }
  }, [token, router.pathname]);

  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </AuthProvider>
  );
}