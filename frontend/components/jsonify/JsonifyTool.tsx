'use client';

import { useState, useCallback } from 'react';
import CodeEditor from '../CodeEditor';
import { Button, Toolbar, SplitPanel } from '../ui';
import { useToolMessage } from '../../hooks';
import { tryParseJson } from '../../lib/jsonify';

export default function JsonifyTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [message, setMessage, clearMessage] = useToolMessage();

  const handleFormat = useCallback(() => {
    clearMessage();
    const result = tryParseJson(input);
    if (!result.ok) {
      setMessage({ type: 'error', text: result.error });
      return;
    }
    setOutput(JSON.stringify(result.value, null, 2));
    setMessage({ type: 'success', text: 'Formatted successfully.' });
  }, [input, clearMessage, setMessage]);

  const handleMinify = useCallback(() => {
    clearMessage();
    const result = tryParseJson(input);
    if (!result.ok) {
      setMessage({ type: 'error', text: result.error });
      return;
    }
    setOutput(JSON.stringify(result.value));
    setMessage({ type: 'success', text: 'Minified successfully.' });
  }, [input, clearMessage, setMessage]);

  const handleValidate = useCallback(() => {
    clearMessage();
    const result = tryParseJson(input);
    if (result.ok) {
      setMessage({ type: 'success', text: 'Valid JSON.' });
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
        <Button onClick={handleFormat}>Format JSON</Button>
        <Button onClick={handleMinify}>Minify JSON</Button>
        <Button onClick={handleValidate}>Validate JSON</Button>
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </Toolbar>
      <SplitPanel>
        <CodeEditor
          label="Input"
          placeholder='{"key": "value"}'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="JSON input"
        />
        <CodeEditor
          label="Output"
          placeholder="Formatted or minified JSON will appear here."
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          aria-label="JSON output"
        />
      </SplitPanel>
    </div>
  );
}
