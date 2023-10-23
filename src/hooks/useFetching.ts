import { useState, useEffect } from "react";

function useFetching<T = unknown>(
  url: string,
  options?: RequestInit,
  customUrl?: boolean
): { data?: T; error?: Error; response?: Response; isLoading: boolean } {
  const [data, setData] = useState<T>();
  const [response, setResponse] = useState<Response>();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          customUrl ? "https://dev.artux.net" : "" + url,
          {
            ...options,
            headers: {
              Authorization: `Basic ${localStorage.getItem("token")}`,
            },
          }
        );
        setResponse(response);
        const json = await response.json();

        setData(json);
      } catch (error: unknown) {
        if (error instanceof Error) setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, error, response, isLoading };
}

export default useFetching;
