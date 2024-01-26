import { Box } from "@chakra-ui/react";
import { FC } from "react";

export interface ActionEditorProps {
  action: {
    [key: string]: string;
  };
  setAction: (action: { [key: string]: string }) => void;
}

const ActionEditor: FC<ActionEditorProps> = () => {
  return <Box></Box>;
};

export { ActionEditor };
