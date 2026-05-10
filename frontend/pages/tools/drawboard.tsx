import Head from 'next/head';
import DrawboardTool from '@/components/drawboard/DrawboardTool';

export default function DrawboardPage() {
  return (
    <>
      <Head>
        <title>Drawboard – ToolNest</title>
        <meta name="description" content="Infinite drawing canvas. Diagrams, text, export as PNG." />
      </Head>
      <DrawboardTool />
    </>
  );
}
