import React from "react";
import { Button, useColorMode } from "@chakra-ui/react";

interface Props {
  rounded: boolean;
}

const ChangeThemeButton = ({ rounded }: Props) => {
  const { toggleColorMode } = useColorMode();

  return (
    <Button
      fontWeight="normal"
      onClick={() => toggleColorMode()}
      size={rounded ? "md" : "sm"}
      mr={rounded ? 0 : 1}
    >
      Сменить тему
    </Button>
  );
};

export default ChangeThemeButton;
