import React from "react";

interface data {}

interface Props {
  data: data;
  isConnectable: any;
  selected: boolean;
}

const TransitionFromMap: React.FC<Props> = ({
  data,
  isConnectable,
  selected,
}) => {
  return <div></div>;
};

export default TransitionFromMap;
