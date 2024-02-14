import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";

export interface WindowProps {
  children: ReactNode;
}

const Window: FC<WindowProps> = ({ children }) => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    width: 300,
    height: 2000,
  });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const window = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isMouseDown) {
        const rect = window.current?.getBoundingClientRect()!;

        setPosition((old) => ({
          ...old,
          x: event.clientX - rect.width / 2,
          y: event.clientY - 10,
        }));
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMouseDown]);

  const handleMouseDown = (_: MouseEvent) => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  return (
    <Box
      ref={window}
      position="absolute"
      style={{
        top: position.y,
        left: position.x,
        resize: "both",
      }}
      width={300}
      height={200}
      rounded="md"
      zIndex={100}
      bg="white"
      _dark={{
        bg: "gray.900",
      }}
      onMouseUp={handleMouseUp}
      userSelect="none"
    >
      <Box
        display="flex"
        justifyContent="center"
        userSelect="none"
        onMouseDown={handleMouseDown as any}
        onMouseUp={handleMouseUp}
      >
        <div>···</div>
      </Box>
      <Box p={1}>{children}</Box>
    </Box>
  );
};

export { Window };
