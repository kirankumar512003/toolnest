import Head from 'next/head';
import Layout from '@/components/Layout';
import PdfToDocTool from '@/components/pdf/PdfToDocTool';
import { TabbedToolViewer } from '@/components/ui';

export default function PdfToDocPage() {
  return (
    <>
      <Head>
        <title>PDF to Doc – ToolNest</title>
        <meta name="description" content="Extract text and content from any PDF file. Save as plain text." />
      </Head>
      <Layout title="PDF to Doc" privacyNote="Processed locally, never stored">
        <TabbedToolViewer toolComponent={PdfToDocTool} tabPrefix="Extract" />
      </Layout>
    </>
  );
}
