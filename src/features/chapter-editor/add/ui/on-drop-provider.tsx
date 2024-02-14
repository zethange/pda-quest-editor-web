import { FC, ReactNode, useRef } from "react";
import { Box } from "@chakra-ui/react";

export interface OnDropProviderProps {
  children: ReactNode;
}

const OnDropProvider: FC<OnDropProviderProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  return <Box ref={ref}>{children}</Box>;
};

export { OnDropProvider };
