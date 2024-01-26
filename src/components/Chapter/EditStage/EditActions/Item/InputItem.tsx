import { Input } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  value: string;
  onChange: (e: string) => void;
}

const InputItem: FC<Props> = ({ value, onChange }) => {
  return (
    <Input
      defaultValue={value}
      onBlur={(e) => {
        onChange(e.target.value);
      }}
    />
  );
};

export default InputItem;
