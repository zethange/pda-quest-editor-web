import { Box, IconButton } from "@chakra-ui/react";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";

export interface WindowProps {
  children: ReactNode;
  width?: number;
  height?: number;
  top?: number;
  title?: string;
  onClose?: () => void;
}

const Window: FC<WindowProps> = ({
  children,
  width = 300,
  height = 200,
  top = 0,
  title = "···",
  onClose = () => {},
}) => {
  const [position, setPosition] = useState({
    x: window.innerWidth - width - 10,
    y: 10,
    width: width,
    height: height,
  });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isResize, setIsResize] = useState(false);
  const okno = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isMouseDown) {
        setPosition((old) => ({
          ...old,
          x: event.clientX - 10,
          y: event.clientY - 10 - top,
        }));
      } else if (isResize) {
        const rect = okno.current?.getBoundingClientRect()!;
        okno.current!.style.width = `${event.clientX - rect.x + 10}px`;
        okno.current!.style.height = `${event.clientY - rect.y + 10}px`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMouseDown, isResize]);

  const handleMouseDown = (_: MouseEvent) => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  return (
    <Box
      ref={okno}
      position="absolute"
      style={{
        top: position.y,
        left: position.x,
        resize: "both",
      }}
      width={position.width}
      height={position.height}
      rounded="md"
      zIndex={100}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      _dark={{
        bg: "gray.900",
        borderColor: "gray.700",
      }}
      onMouseUp={handleMouseUp}
      userSelect="none"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        p={1}
        alignItems="center"
        userSelect="none"
        onMouseDown={handleMouseDown as any}
        onMouseUp={handleMouseUp}
      >
        <Box fontWeight="bold">{title}</Box>
        <IconButton
          icon={<MdClose />}
          aria-label="Закрыть окно"
          size="xs"
          onClick={onClose}
        />
      </Box>
      <Box p={1}>{children}</Box>
      <Box
        position="absolute"
        cursor="se-resize"
        bottom={0}
        right={0}
        width={10}
        height={10}
        zIndex={101}
        onMouseDown={() => {
          setIsResize(true);
        }}
        onMouseUp={() => {
          setIsResize(false);
        }}
      ></Box>
    </Box>
  );
};

export { Window };
