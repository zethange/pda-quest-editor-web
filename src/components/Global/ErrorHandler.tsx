import { useToast } from "@chakra-ui/react";
import { FC } from "react";

export interface FallbackRenderProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const FallbackRender: FC<FallbackRenderProps> = ({ error }) => {
  const toast = useToast();

  toast({
    title: "Произошла ошибка",
    description: error.message,
    isClosable: true,
    status: "error",
    duration: 5000,
    position: "bottom-right",
  });

  return <></>;
};

export { FallbackRender };
