import React from "react";
import { Button, useColorMode } from "@chakra-ui/react";

interface Props {
  rounded: boolean;
}

const ChangeThemeButton = ({ rounded }: Props) => {
  const { toggleColorMode } = useColorMode();

  return (
    <Button
      borderRadius={rounded ? "md" : 0}
      fontWeight="normal"
      onClick={() => toggleColorMode()}
    >
      Сменить тему
    </Button>
  );
};

export default ChangeThemeButton;
