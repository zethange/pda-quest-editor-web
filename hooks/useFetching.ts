import { useState } from "react";

export const useFetching = (callback: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetching = async (...args: any) => {
    try {
      setIsLoading(true);
      await callback(...args);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return [fetching, isLoading, error];
};
