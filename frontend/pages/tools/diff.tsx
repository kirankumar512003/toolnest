import Head from 'next/head';
import Layout from '../../components/Layout';
import DiffEditorTool from '../../components/diff/DiffEditorTool';
import { TabbedToolViewer } from '../../components/ui';

export default function DiffPage() {
  return (
    <>
      <Head>
        <title>Diff Editor – ToolNest</title>
        <meta name="description" content="Compare two texts or code snippets side by side." />
      </Head>
      <Layout title="Diff Editor">
        <TabbedToolViewer toolComponent={DiffEditorTool} tabPrefix="Diff" />
      </Layout>
    </>
  );
}
