import { FC, useEffect, useRef, useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { Image } from "react-konva";
import Konva from "konva";

interface Props {
  props: Partial<HTMLImageElement>;
  onClick: (event: { x: number; y: number }) => void;
  set: (event: { width: number; height: number }) => void;
}

const KonvaMap: FC<Props> = ({ props, onClick, set }) => {
  const [image, setImage] = useState<HTMLImageElement>();
  const imageRef = useRef<Konva.Image>(null);

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    const pointerPos = e.target.getStage()?.getPointerPosition();
    const imagePos = imageRef?.current?.getAbsolutePosition();
    const imageScale = imageRef?.current?.getAbsoluteScale();
    if (pointerPos && imagePos && imageScale && image) {
      console.log(image.height, image.width);

      const x = Math.round((pointerPos.x - imagePos.x) / imageScale.x);
      const y = Math.round(
        image.height - (pointerPos.y - imagePos.y) / imageScale.y
      );
      onClick({
        x,
        y,
      });
    }
  };

  useEffect(() => {
    const img = new window.Image();
    if (props.src) {
      img.src = props.src;
    }
    img.onload = () => {
      setImage(img);
      set({ height: img.height, width: img.width });
    };
  }, []);

  return (
    <Image
      ref={imageRef as any}
      image={image}
      onContextMenu={(e) => handleClick(e)}
      {...props}
    />
  );
};

export default KonvaMap;
