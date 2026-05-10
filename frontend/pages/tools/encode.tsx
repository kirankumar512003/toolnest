import Head from 'next/head';
import Layout from '@/components/Layout';
import EncodeTool from '@/components/encode/EncodeTool';
import { TabbedToolViewer } from '@/components/ui';

export default function EncodePage() {
  return (
    <>
      <Head>
        <title>Cipher Lab – ToolNest</title>
        <meta name="description" content="Encode and decode Base64 and URL." />
      </Head>
      <Layout title="Cipher Lab">
        <TabbedToolViewer toolComponent={EncodeTool} tabPrefix="Lab" />
      </Layout>
    </>
  );
}
