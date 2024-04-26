"use client"

import { QueryClient, QueryClientProvider } from "react-query"
import React from "react"
import { PropsWithChildren } from "react"

const client = new QueryClient()

const Providers = ({children}: PropsWithChildren<{}>) => {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

export default Providers