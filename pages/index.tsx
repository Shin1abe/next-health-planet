import React from 'react'
import { Box } from '@chakra-ui/react'
import HPOAuth from './components/HPOAuth'
import Head from 'next/head'

const IndexPage = () => {
  return (
    <div>
      <Head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store" />
      </Head>
      <Box>
        <HPOAuth />
        {/* <InnerScanTable /> */}
      </Box>
    </div>
  )
}

export default IndexPage

// import Link from 'next/link'
// import Layout from '../components/Layout'

// const IndexPage = () => (
//   <Layout title="Home | Next.js + TypeScript Example">
//     <h1>Hello Next.js 👋</h1>
//     <p>
//       <Link href="/about">About</Link>
//     </p>
//   </Layout>
// )

// export default IndexPage
