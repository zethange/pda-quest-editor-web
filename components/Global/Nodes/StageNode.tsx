import React, { useMemo } from "react";
import { Handle, Position } from "reactflow";

type data = {
  label: React.ReactNode;
  text: string;
};

export function NodeStage({
  data,
  isConnectable,
  selected,
}: {
  data: data;
  isConnectable: any;
  selected: boolean;
}) {
  const words = useMemo(() => data?.text?.split(" "), [data]);
  return (
    <div
      className="stage-node"
      style={{
        background: selected ? "var(--light-blue)" : "",
        border: selected ? "1px solid var(--dark-blue)" : "",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="stage-node__label">{data.label}</div>
      <small>{words?.slice(0, 6).join(" ")}...</small>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
}
