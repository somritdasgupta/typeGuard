import React from 'react';
import { CodeEditor } from './CodeEditor';

interface SchemaBuilderProps {
  schema: string;
  onChange: (schema: string) => void;
  selectedExample: string; // Keep this for proper props typing
  onExampleSelect: (exampleName: string) => void; // Keep this for proper props typing
}

// Use all props parameters to keep TypeScript happy, even if we don't use them
export const SchemaBuilder: React.FC<SchemaBuilderProps> = ({
  schema,
  onChange, // Unused but kept for type completeness
}) => {
  return (
    <CodeEditor
      value={schema}
      onChange={onChange}
      language="typescript"
      height="100%"
    />
  );
};
