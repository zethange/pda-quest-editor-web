import { Button, useColorMode } from "@chakra-ui/react";
import { FC } from "react";

export interface ChangeThemeButtonProps {
  rounded: boolean;
  size?: string;
}

const ChangeThemeButton: FC<ChangeThemeButtonProps> = ({
  rounded: _,
  size,
}) => {
  const { toggleColorMode } = useColorMode();

  return (
    <Button
      fontWeight="normal"
      onClick={() => toggleColorMode()}
      size={size || "md"}
    >
      Сменить тему
    </Button>
  );
};

export default ChangeThemeButton;
