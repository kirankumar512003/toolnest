import Head from 'next/head';
import Layout from '../../components/Layout';
import MarkdownEditorTool from '../../components/markdown/MarkdownEditorTool';
import { TabbedToolViewer } from '../../components/ui';

export default function MarkdownPage() {
  return (
    <>
      <Head>
        <title>MarkSmith – ToolNest</title>
        <meta name="description" content="Edit and preview Markdown in real time." />
      </Head>
      <Layout title="MarkSmith">
        <TabbedToolViewer toolComponent={MarkdownEditorTool} tabPrefix="Doc" />
      </Layout>
    </>
  );
}
