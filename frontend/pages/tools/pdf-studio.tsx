import Head from 'next/head';
import Layout from '@/components/Layout';
import PdfStudio from '@/components/pdf/PdfStudio';
import { TabbedToolViewer } from '@/components/ui';

export default function PdfStudioPage() {
  return (
    <>
      <Head>
        <title>PDF Studio – ToolNest</title>
        <meta name="description" content="Merge, split, and extract text from PDFs." />
      </Head>
      <Layout title="PDF Studio">
        <TabbedToolViewer toolComponent={PdfStudio} tabPrefix="Workspace" />
      </Layout>
    </>
  );
}
