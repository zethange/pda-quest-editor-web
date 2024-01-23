import { FC, useEffect } from "react";

export interface CustomHeadProps {
  title: string;
}

const CustomHead: FC<CustomHeadProps> = ({ title }) => {
  useEffect(() => {
    if (!document) return;

    document.querySelector("title")!.innerHTML = `${title} :: PDA Quest Editor`;
  }, []);
  return <></>;
};

export default CustomHead;
