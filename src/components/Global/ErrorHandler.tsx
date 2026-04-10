import React, { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

interface PropsFallback {
  error: Error;
  resetErrorBoundary: () => void;
}

const FallbackRender: React.FC<PropsFallback> = ({ error }) => {
  const toast = useToast();
  const location = useLocation();

  useEffect(() => {
    fetch("/api/error", {
      method: "POST",
      body: JSON.stringify({
        name: error.name,
        message: error.message,
        stack: error.stack,
        router: { pathname: location.pathname, search: location.search },
      }),
    });
  }, [error, location.pathname, location.search]);

  toast({
    title: "Произошла ошибка",
    description: error.message,
    isClosable: true,
    status: "error",
    duration: 5000,
    position: "bottom-right",
  });

  return <div></div>;
};

export { FallbackRender };
