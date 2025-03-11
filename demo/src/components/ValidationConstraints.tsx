import React, { useState } from 'react';

interface ValidationConstraint {
  field: string;
  type: string;
  constraint: string;
}

interface ValidationConstraintsProps {
  constraints: ValidationConstraint[];
  onAddConstraint: (constraint: ValidationConstraint) => void;
  onRemoveConstraint: (index: number) => void;
}

export const ValidationConstraints: React.FC<ValidationConstraintsProps> = ({
  constraints,
  onAddConstraint,
  onRemoveConstraint,
}) => {
  const [newConstraint, setNewConstraint] = useState<ValidationConstraint>({
    field: '',
    type: 'string',
    constraint: 'email',
  });

  const constraintOptions = {
    string: [
      'email',
      'url',
      'uuid',
      'minLength',
      'maxLength',
      'pattern',
      'nonEmpty',
    ],
    number: ['min', 'max', 'positive', 'negative', 'integer'],
    array: ['minItems', 'maxItems', 'unique'],
    date: ['past', 'future', 'minDate', 'maxDate'],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newConstraint.field.trim()) {
      onAddConstraint(newConstraint);
      setNewConstraint({
        field: '',
        type: 'string',
        constraint: constraintOptions.string[0],
      });
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-gray-800 border-l-4 border-blue-500 p-3 flex-shrink-0">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 mr-2 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium text-white">
            Custom Validation Constraints
          </span>
        </div>
        <p className="text-gray-400 text-xs mt-1">
          Add additional validation rules to your type guards
        </p>
      </div>

      {/* Scrollable constraint list area - fixed size */}
      <div className="overflow-auto px-3 py-4 flex-1">
        {/* Constraint List */}
        {constraints.length > 0 && (
          <div className="mb-4">
            <div className="bg-gray-800 text-gray-300 text-xs font-medium py-1 px-3 border-b border-gray-700">
              Active Constraints
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr className="text-left text-xs">
                    <th className="px-3 py-2 text-gray-400 font-medium">
                      Field
                    </th>
                    <th className="px-3 py-2 text-gray-400 font-medium">
                      Type
                    </th>
                    <th className="px-3 py-2 text-gray-400 font-medium">
                      Constraint
                    </th>
                    <th className="px-3 py-2 text-gray-400 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {constraints.map((constraint, index) => (
                    <tr key={index} className="bg-gray-800">
                      <td className="px-3 py-2 text-xs text-gray-300">
                        {constraint.field}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-300">
                        {constraint.type}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-300">
                        {constraint.constraint}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <button
                          onClick={() => onRemoveConstraint(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Constraint Form - Always at bottom of scroll area */}
        <div className="bg-gray-800 p-4 border-l-2 border-green-500 mt-2">
          <h3 className="text-sm font-medium text-white mb-3">
            Add New Constraint
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Field Name
                </label>
                <input
                  type="text"
                  value={newConstraint.field}
                  onChange={(e) =>
                    setNewConstraint({
                      ...newConstraint,
                      field: e.target.value,
                    })
                  }
                  className="w-full text-xs bg-gray-900 border border-gray-700 rounded-sm py-1.5 px-2 text-gray-200"
                  placeholder="e.g. email"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newConstraint.type}
                  onChange={(e) => {
                    const type = e.target
                      .value as keyof typeof constraintOptions;
                    setNewConstraint({
                      ...newConstraint,
                      type,
                      constraint: constraintOptions[type][0],
                    });
                  }}
                  className="w-full text-xs bg-gray-900 border border-gray-700 rounded-sm py-1.5 px-2 text-gray-200"
                >
                  {Object.keys(constraintOptions).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Constraint
                </label>
                <select
                  value={newConstraint.constraint}
                  onChange={(e) =>
                    setNewConstraint({
                      ...newConstraint,
                      constraint: e.target.value,
                    })
                  }
                  className="w-full text-xs bg-gray-900 border border-gray-700 rounded-sm py-1.5 px-2 text-gray-200"
                >
                  {constraintOptions[
                    newConstraint.type as keyof typeof constraintOptions
                  ].map((constraint) => (
                    <option key={constraint} value={constraint}>
                      {constraint}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-md"
              >
                Add Constraint
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
