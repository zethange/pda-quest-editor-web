import { Button, useColorMode } from "@chakra-ui/react";
import { FC } from "react";

export interface ChangeThemeButtonProps {
  rounded: boolean;
}

const ChangeThemeButton: FC<ChangeThemeButtonProps> = ({ rounded }) => {
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
