import Head from 'next/head';
import Layout from '../../components/Layout';

export default function ScratchpadPage() {
  return (
    <>
      <Head>
        <title>Blank Space – ToolNest</title>
      </Head>
      <Layout title="Blank Space">
        <p className="text-sm text-[var(--text-muted)]">Distraction-free scratchpad. Coming soon.</p>
      </Layout>
    </>
  );
}
