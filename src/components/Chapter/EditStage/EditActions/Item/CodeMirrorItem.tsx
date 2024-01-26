import { StreamLanguage } from "@codemirror/language";
import { lua } from "@codemirror/legacy-modes/mode/lua";
import CodeMirror from "@uiw/react-codemirror";
import { FC } from "react";

interface Props {
  value: string;
  onChange: (e: string) => void;
}

const CodeMirrorItem: FC<Props> = ({ value, onChange }) => {
  return (
    <CodeMirror
      value={value}
      height="200px"
      extensions={[StreamLanguage.define(lua)]}
      onBlur={(event) => {
        onChange(event.target.innerText);
      }}
    />
  );
};

export default CodeMirrorItem;
