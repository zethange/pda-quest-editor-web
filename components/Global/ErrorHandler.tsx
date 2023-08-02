import React, { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface PropsFallback {
  error: Error;
  resetErrorBoundary: () => void;
}

const FallbackRender: React.FC<PropsFallback> = ({ error }) => {
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/error", {
      method: "POST",
      body: JSON.stringify({
        name: error.name,
        message: error.message,
        stack: error.stack,
        router: { query: router.query, pathname: router.pathname },
      }),
    });
  }, []);

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
