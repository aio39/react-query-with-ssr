import "@/styles/globals.css";
import { NextPageContext } from "next";
import type { AppProps } from "next/app";
import { useState } from "react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
  dehydrate,
} from "react-query";

export default function App({
  Component,
  pageProps,
  dehydratedState,
}: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  console.log("pageProps", dehydratedState);
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}

App.getInitialProps = async (context: NextPageContext) => {
  const requiredResources = context.Component.requiredResources;
  const queryClient = new QueryClient();

  if (requiredResources?.length > 0) {
    await Promise.all(
      requiredResources.map(async (resource: any) => {
        return queryClient.fetchQuery({
          queryKey: resource.key,
          queryFn: resource.fetcher,
          staleTime: Infinity,
        });
      }),
    );
  }

  return {
    dehydratedState: dehydrate(queryClient),
  };
};
