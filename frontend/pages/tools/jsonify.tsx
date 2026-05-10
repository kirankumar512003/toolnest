import Head from 'next/head';
import Layout from '@/components/Layout';
import JsonifyTool from '@/components/jsonify/JsonifyTool';
import { TabbedToolViewer } from '@/components/ui';

export default function JsonifyPage() {
  return (
    <>
      <Head>
        <title>JSONify – ToolNest</title>
        <meta name="description" content="Format, minify and validate JSON." />
      </Head>
      <Layout title="JSONify">
        <TabbedToolViewer toolComponent={JsonifyTool} tabPrefix="JSON" />
      </Layout>
    </>
  );
}
