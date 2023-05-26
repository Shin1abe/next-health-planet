import React from 'react'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { ChakraProvider } from '@chakra-ui/react'
// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

export const theme = extendTheme({ colors })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <RecoilRoot>で囲うことで、その中でRecoilが利用できるようになる
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </ChakraProvider>
  )
}
export default MyApp
