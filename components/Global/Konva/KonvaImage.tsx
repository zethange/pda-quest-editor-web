import { FC, useEffect, useState } from "react";
import { Image } from "react-konva";

const KonvaImage: FC<Partial<HTMLImageElement>> = (props) => {
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    const img = new window.Image();
    if (props.src) {
      img.src = props.src;
    }
    img.onload = () => {
      setImage(img);
    };
  }, [props.src]);

  return <Image alt={props.alt} image={image} {...props} />;
};

export default KonvaImage;
