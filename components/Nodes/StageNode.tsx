import React, { useCallback } from "react";
import { Handle, Position } from "reactflow";

type data = {
  label: React.ReactNode;
  text: string;
};

export function NodeStage({
  data,
  isConnectable,
}: {
  data: data;
  isConnectable: any;
}) {
  const words = data?.text?.split(" ");

  const requireDeleteWords = data?.text?.split(" ").length - 6;

  words?.splice(5, requireDeleteWords);

  return (
    <div className="stage-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="stage-node__label">{data.label}</div>
      <small>{words?.join(" ")}...</small>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
}
