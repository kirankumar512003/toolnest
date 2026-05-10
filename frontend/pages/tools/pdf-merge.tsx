import Head from 'next/head';
import Layout from '@/components/Layout';
import PdfMergeTool from '@/components/pdf/PdfMergeTool';
import { TabbedToolViewer } from '@/components/ui';

export default function PdfMergePage() {
  return (
    <>
      <Head>
        <title>PDF Merge – ToolNest</title>
        <meta name="description" content="Combine multiple PDF files into one. Reorder pages before merging." />
      </Head>
      <Layout title="PDF Merge" privacyNote="Processed locally, never stored">
        <TabbedToolViewer toolComponent={PdfMergeTool} tabPrefix="Merge" />
      </Layout>
    </>
  );
}
