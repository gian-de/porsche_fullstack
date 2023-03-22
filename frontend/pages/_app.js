import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <AnimatePresence mode="wait">
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </AnimatePresence>
    </ThemeProvider>
  );
}
