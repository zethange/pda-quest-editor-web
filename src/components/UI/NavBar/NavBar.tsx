import { Box } from "@chakra-ui/react";
import { FC, ReactNode, memo } from "react";

export interface NavBarProps {
  children: ReactNode;
}

const NavBar: FC<NavBarProps> = ({ children }) => {
  return (
    <Box
      display="flex"
      p={2}
      gap={2}
      borderBottom="1px"
      _dark={{
        borderColor: "gray.600",
      }}
      alignItems="center"
      borderBottomColor="gray.200"
    >
      {children}
    </Box>
  );
};

export default memo(NavBar);
