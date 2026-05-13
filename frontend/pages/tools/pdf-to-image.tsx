import Head from 'next/head';
import Layout from '../../components/Layout';
import PdfToImageTool from '../../components/pdf/PdfToImageTool';
import { TabbedToolViewer } from '../../components/ui';

export default function PdfToImagePage() {
  return (
    <>
      <Head>
        <title>PDF to Image – ToolNest</title>
        <meta name="description" content="Convert PDF pages to high-resolution PNG images. Download individually or all at once." />
      </Head>
      <Layout title="PDF to Image" privacyNote="Processed locally, never stored">
        <TabbedToolViewer toolComponent={PdfToImageTool} tabPrefix="Convert" />
      </Layout>
    </>
  );
}
