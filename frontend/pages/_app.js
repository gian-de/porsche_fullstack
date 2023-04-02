import "@/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <AnimatePresence mode="wait">
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </AnimatePresence>
  );
}
