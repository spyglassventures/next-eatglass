import React, { useState } from "react";
import recallConfig from "@/components/IntRecall/recallConfigHandler";
import { FormField } from "@/components/Common/CrudForms/fieldConfig";
import { TRecallEntry } from "@/components/IntRecall/RecallListSchemaV1";


const ExpandableJsonCell: React.FC<{
  jsonText: string;
  defaultExpanded?: boolean;
}> = ({ jsonText, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  let parsed: any;
  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    return <div style={{ whiteSpace: "pre-wrap" }}>{jsonText}</div>;
  }
  const messages = parsed.messages;
  if (!messages || !Array.isArray(messages)) {
    return <div style={{ whiteSpace: "pre-wrap" }}>{jsonText}</div>;
  }

  const displayMessages = expanded ? messages : messages.slice(0, 2);

  return (
    <div className="text-xs">
      {displayMessages.map((msg: any, index: number) => (
        <div key={index}>
          <strong>{msg.role}:</strong>{" "}
          {msg.role === "user" ? (
            <span style={{ backgroundColor: "yellow", padding: "0 2px" }}>
              {msg.content}
            </span>
          ) : (
            msg.content
          )}
        </div>
      ))}
      {messages.length > displayMessages.length &&
        !defaultExpanded &&
        !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-blue-500 underline"
          >
            Read More
          </button>
        )}
      {!defaultExpanded && expanded && messages.length > 2 && (
        <button
          onClick={() => setExpanded(false)}
          className="ml-2 text-blue-500 underline"
        >
          Show Less
        </button>
      )}
    </div>
  );
};

export const ExpandableCell: React.FC<{
  text: string;
  limit?: number;
  alwaysExpanded?: boolean;
}> = ({ text, limit = 50, alwaysExpanded = false }) => {
  // Attempt to parse the text as JSON.
  // This is done unconditionally.
  const parsed = (() => {
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  })();
  const hasMessages =
    parsed && parsed.messages && Array.isArray(parsed.messages);

  // Always call the hook
  const [expanded, setExpanded] = useState(false);

  // If the text contains a valid messages array, delegate to ExpandableJsonCell.
  if (hasMessages) {
    return (
      <ExpandableJsonCell jsonText={text} defaultExpanded={alwaysExpanded} />
    );
  }

  // If alwaysExpanded, render the full text.
  if (alwaysExpanded) {
    return (
      <div className="text-xs">
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{text}</pre>
      </div>
    );
  }

  // Otherwise, use the expandable/collapsible logic.
  const toggle = () => setExpanded(!expanded);
  const safeText = text || "";
  const displayText =
    !expanded && safeText.length > limit
      ? safeText.substring(0, limit)
      : safeText;

  return (
    <div className="text-xs">
      <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{displayText}</pre>
      {!expanded && safeText.length > limit && "..."}
      {safeText.length > limit && (
        <button onClick={toggle} className="ml-1 text-blue-500 underline">
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export interface HeaderRowFactoryIF {
  (fieldKeys: string[]): React.JSX.Element;
  getHeaderLabel: (key: string) => string;
}

export const HeaderRowFactory: HeaderRowFactoryIF = (
  (): HeaderRowFactoryIF => {

    const getHeaderLabel = (key: string) => {
      const specialMapping = {"id": "ID", "created_at": "erstellt am"}
      if (key in specialMapping) {
        return specialMapping[key]
      }
      const field = recallConfig.getFieldAlias(key);
      return (field === undefined) ? "UNDEFINED" : (field.label ?? field.name);
    }

    const inner= (fieldKeys: string[]) => {
      return (
        <thead className="bg-gray-50">
        <tr>
          {fieldKeys.map((fieldKey: string) => (
            <th key={`th-${fieldKey}`} className="border px-4 py-2">
              {getHeaderLabel(fieldKey)}
            </th>
          ))}
        </tr>
        </thead>
      );
    }

    inner.getHeaderLabel = getHeaderLabel;
    return inner
  }
)()

export interface PreviewRowFactoryIF {
  (entry: TRecallEntry, fieldKeys: string[]): React.JSX.Element[];
  createFieldCell: (
    field: FormField,
    value: string | number,
    elementKey: string
  ) => React.JSX.Element;
  createExpandableFieldCell: (
    value: string | number,
    elementKey: string
  ) => React.JSX.Element;
}

export const PreviewRowFactory: PreviewRowFactoryIF = (
  (): PreviewRowFactoryIF => {

    const createExpandableFieldCell= (
      value: string,
      elementKey:string
    ) => {
      return (
        <td key={elementKey} className="whitespace-pre-wrap border px-4 py-2">
          <ExpandableCell text={value} limit={50} />
        </td>
      );
    }

    const createFieldCell= (
      field: FormField,
      value: string | number,
      elementKey: string
    ) => {
      if (!Array.isArray(field.values) && (field.nRows ?? 3) > 1) {
        return createExpandableFieldCell(`${value}`, elementKey)
      }
      return (
        <td key={elementKey} className="border px-4 py-2">{value}</td>
      );
    }

    const inner = (
      entry: TRecallEntry,
      fieldKeys: string[]
    ) => {
      return fieldKeys.map((fieldKey: string) => {
        const elementKey = `td-${fieldKey}-${entry.id}`;
        const field = recallConfig.getFieldAlias(fieldKey);
        if (field === undefined) {
          return (
            <td key={elementKey} className="border px-4 py-2">UNDEFINED</td>
          );
        }
        const value = entry[fieldKey];
        return createFieldCell(field, value, elementKey);
      })
    };

    inner.createFieldCell = createFieldCell;
    inner.createExpandableFieldCell = createExpandableFieldCell;
    return inner;
  }
)()
