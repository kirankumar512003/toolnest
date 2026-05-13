'use client';

import { useState, useCallback } from 'react';
import CodeEditor from '@/components/CodeEditor';
import { Button, Toolbar, SplitPanel, SectionLabel } from '@/components/ui';
import { useToolMessage } from '@/hooks';
import { 
  runBase64Encode, runBase64Decode,
  runUrlEncode, runUrlDecode,
  runHtmlEncode, runHtmlDecode
} from '@/lib/encode';

export default function EncodeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [message, setMessage, clearMessage] = useToolMessage();

  const handleEncodeBase64 = useCallback(() => {
    clearMessage();
    const result = runBase64Encode(input);
    if (result.ok) {
      setOutput(result.value);
      setMessage({ type: 'success', text: 'Encoded to Base64.' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  }, [input, clearMessage, setMessage]);

  const handleDecodeBase64 = useCallback(() => {
    clearMessage();
    const result = runBase64Decode(input);
    if (result.ok) {
      setOutput(result.value);
      setMessage({ type: 'success', text: 'Decoded from Base64.' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  }, [input, clearMessage, setMessage]);

  const handleEncodeUrl = useCallback(() => {
    clearMessage();
    setOutput(runUrlEncode(input));
    setMessage({ type: 'success', text: 'URL encoded.' });
  }, [input, clearMessage, setMessage]);

  const handleDecodeUrl = useCallback(() => {
    clearMessage();
    const result = runUrlDecode(input);
    if (result.ok) {
      setOutput(result.value);
      setMessage({ type: 'success', text: 'URL decoded.' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  }, [input, clearMessage, setMessage]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setMessage(null);
  }, [setMessage]);

  return (
    <div className="flex flex-col gap-4">
      <Toolbar message={message}>
        <Button onClick={handleEncodeBase64}>Encode Base64</Button>
        <Button onClick={handleDecodeBase64}>Decode Base64</Button>
        <Button onClick={handleEncodeUrl}>Encode URL</Button>
        <Button onClick={handleDecodeUrl}>Decode URL</Button>
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </Toolbar>
      <SplitPanel>
        <CodeEditor
          label="Input"
          placeholder="Paste or type text to encode or decode..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Encode/decode input"
        />
        <CodeEditor
          label="Output"
          placeholder="Result will appear here."
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          aria-label="Encode/decode output"
        />
      </SplitPanel>
    </div>
  );
}
