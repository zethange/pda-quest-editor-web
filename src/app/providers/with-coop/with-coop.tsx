import { useCoopStore } from "@/entities/cooperative";
import { AlertOnRequest } from "@/features/cooperative";
import { login } from "@/shared/api";
import { COOPERATIVE_URL } from "@/shared/config";
import { useToast } from "@chakra-ui/react";
import { FC, ReactNode, useEffect } from "react";

export interface WithCoopProps {
  children: ReactNode;
}

const WithCoop: FC<WithCoopProps> = ({ children }) => {
  const { setWs, setId } = useCoopStore();
  // const { stories, setStories } = useStoryStore();
  const toast = useToast();

  useEffect(() => {
    // if (ws) return;

    (async () => {
      const data = await login(Math.random().toString());

      if (data.ok) {
        setId(data.userId);
      } else {
        toast({
          title: "Ошибка",
          description: data.msg,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }

      const ws = new WebSocket(
        `ws://${COOPERATIVE_URL}/echo?userId=${data.userId}`
      );

      ws.onopen = () => {};
      ws.onmessage = (e) => {
        console.log(e.data);
      };
      ws.onclose = () => {};
      setWs(ws);
    })();
  }, []);
  return (
    <>
      <AlertOnRequest />
      {children}
    </>
  );
};

export default WithCoop;
