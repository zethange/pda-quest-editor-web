import React, { memo } from "react";
import { Box } from "@chakra-ui/react";

const NavBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      display="flex"
      p={2}
      gap={2}
      borderBottom="1px"
      alignItems="center"
      borderBottomColor="gray.200"
    >
      {children}
    </Box>
  );
};

export default memo(NavBar);
