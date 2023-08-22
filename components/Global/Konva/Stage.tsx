"use client";

import { Stage as StageKonva, Layer } from "react-konva";

import { FC, ReactNode, useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";

interface Props {
  children: ReactNode;
  width: number;
  height: number;
}

const Stage: FC<Props> = ({ children, width, height }) => {
  const [scale, setScale] = useState(1);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointerPosition, setLastPointerPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage?.scaleX() || 0;

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setScale(newScale);
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    setIsDragging(true);
    setLastPointerPosition({ x: e.evt.clientX, y: e.evt.clientY });
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDragging) {
      return;
    }
    const dx = e.evt.clientX - lastPointerPosition.x;
    const dy = e.evt.clientY - lastPointerPosition.y;
    const newPosition = {
      x: cameraPosition.x + dx,
      y: cameraPosition.y + dy,
    };
    setCameraPosition(newPosition);
    setLastPointerPosition({ x: e.evt.clientX, y: e.evt.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <StageKonva
      width={width}
      height={height}
      scale={{ x: scale, y: scale }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <Layer x={cameraPosition.x} y={cameraPosition.y}>
        {children}
      </Layer>
    </StageKonva>
  );
};
export default Stage;
