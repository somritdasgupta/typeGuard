import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'json',
}) => {
  return (
    <div className="h-full w-full min-h-[100vh] sm:min-h-[45vh]">
      <MonacoEditor
        height="100%"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(value) => onChange(value || '')}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 12,
          fontFamily: "'Fira Code', 'Consolas', monospace",
          automaticLayout: true,
          lineNumbers: 'on',
          tabSize: 2,
          wordWrap: 'on',
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
        }}
        loading={
          <div className="h-full w-full flex items-center justify-center bg-gray-850">
            <div className="text-gray-400 text-sm">Loading editor...</div>
          </div>
        }
      />
    </div>
  );
};
