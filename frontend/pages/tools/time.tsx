import Head from 'next/head';
import Layout from '@/components/Layout';
import TimeForgeTool from '@/components/time/TimeForgeTool';
import { TabbedToolViewer } from '@/components/ui';

export default function TimePage() {
  return (
    <>
      <Head>
        <title>Time Forge – ToolNest</title>
        <meta name="description" content="Convert epoch timestamps and dates. ISO, UTC, local." />
      </Head>
      <Layout title="Time Forge">
        <TabbedToolViewer toolComponent={TimeForgeTool} tabPrefix="Time" />
      </Layout>
    </>
  );
}
