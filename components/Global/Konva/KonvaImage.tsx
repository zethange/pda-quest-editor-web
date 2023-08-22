import { FC, useEffect, useState } from "react";
import { Image } from "react-konva";

const KonvaImage: FC<Partial<HTMLImageElement>> = (props) => {
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    const img = new window.Image();
    img.src = props?.src!;
    img.onload = () => {
      setImage(img);
    };
  }, []);

  return <Image image={image} {...props} />;
};

export default KonvaImage;
