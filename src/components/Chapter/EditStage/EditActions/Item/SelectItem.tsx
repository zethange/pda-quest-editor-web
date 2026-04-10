import { FC, useState } from "react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useUnit } from "effector-react";
import { $parameters } from "@/features/stage-editor";

interface Props {
  value: string;
  onChange: (e: string) => void;
}

const SelectItem: FC<Props> = ({ value: importValue, onChange }) => {
  const parameters = useUnit($parameters);
  const [value, setValue] = useState(importValue);

  return (
    <AutoComplete
      openOnFocus
      value={value}
      onChange={(value) => {
        setValue(value);
        onChange(value);
      }}
    >
      <AutoCompleteInput
        placeholder="Параметер..."
        variant="outline"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={(e) => {
          onChange(e.target.value);
        }}
      />
      <AutoCompleteList>
        {parameters.map((parameter, index) => (
          <AutoCompleteItem key={index} value={parameter} textTransform="none">
            {parameter}
          </AutoCompleteItem>
        ))}
      </AutoCompleteList>
    </AutoComplete>
  );
};

export default SelectItem;
