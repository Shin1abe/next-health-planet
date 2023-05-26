import InnerScanTable from "./components/InnerScanTable";
import HPOAuth from "./components/HPOAuth";
import { Box } from '@chakra-ui/react';

const IndexPage = () => {
  return (
    <Box>
      <HPOAuth />
      {/* <InnerScanTable /> */}
    </Box>
  );
};

export default IndexPage;

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
