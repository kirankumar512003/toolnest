import Head from 'next/head';
import Layout from '../../components/Layout';
import TabbedToolViewer from '../../components/ui/TabbedToolViewer';
import MermaidVisualizerTool from '../../components/mermaid/MermaidVisualizerTool';

export default function MermaidPage() {
  return (
    <Layout 
      title="Mermaid Visualizer" 
      privacyNote="Diagrams are rendered entirely in your browser. No data is sent to external servers."
    >
      <Head>
        <title>Mermaid Visualizer | ToolNest</title>
      </Head>
      
      <TabbedToolViewer
        toolComponent={MermaidVisualizerTool}
        tabPrefix="Diagram"
      />
    </Layout>
  );
}
