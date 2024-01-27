import { useCoopStore } from "@/entities/cooperative";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const AlertOnRequest = () => {
  const { ws, handleMessage, id } = useCoopStore();
  const [info, setInfo] = useState({
    data: {
      id: "",
      storyId: "",
      userId: "",
    },
    login: "",
    storyId: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    handleMessage((e) => {
      const data = JSON.parse((e as MessageEvent).data);

      if (data.type === "REQUEST_SHARE_STORY") {
        setInfo({
          data: data.requestShareStory.data,
          login: data.requestShareStory.userLogin,
          storyId: data.requestShareStory.storyId,
        });
        onOpen();
      }
    });
  }, []);

  const ref = useRef<HTMLButtonElement>(null);

  const answer = (allow: boolean) => {
    ws?.send(
      JSON.stringify({
        id: id,
        type: "ANSWER_REQUEST",
        answerRequest: {
          id: info.data.id,
          allow,
        },
      })
    );
    onClose();
  };

  return (
    <AlertDialog
      leastDestructiveRef={ref}
      motionPreset="slideInBottom"
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Запрос доступа к истории</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Пользователь `{info.login}` хочет получить доступ к истории с ID: `
          {info.storyId}`
        </AlertDialogBody>
        <AlertDialogFooter display="flex" gap={2}>
          <Button
            ref={ref}
            onClick={() => {
              answer(false);
            }}
          >
            Запретить
          </Button>
          <Button colorScheme="red" onClick={() => answer(true)}>
            Разрешить
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { AlertOnRequest };
