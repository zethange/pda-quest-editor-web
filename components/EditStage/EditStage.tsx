import {
  editBackgroundInStore,
  editMessageInStore,
  editTextInStore,
  editTitleInStore,
  newTextToStore,
  storeStage,
} from "@/store/store";
import React, { useState } from "react";
import { Box, Button, Flex, Input, Spacer, Textarea } from "@chakra-ui/react";
import Confetti from "react-confetti";

export default function EditStage({ data }: { data: any }) {
  const [rerender, setRerender] = useState<boolean>(false);
  const [checkBoxMessage, setCheckBoxMessage] = useState<boolean>(false);

  return (
    <>
      <Box
        p={2}
        background={`
            url(${
              storeStage?.background
                ? `https://cdn.artux.net/static/${data?.background}`
                : "/no_background.png"
            })
          `}
        backgroundRepeat="no-repeat"
        backgroundSize="408px"
        backgroundPosition="center top"
        border={!storeStage?.background ? "1px solid" : "0 solid"}
        borderColor="gray.100"
        borderRadius="10px"
        height="215px"
        position="relative"
      >
        <Box
          display="grid"
          gridColumn="1"
          height="199px"
          alignContent="space-between"
        >
          {JSON.stringify(storeStage).includes("Максим лох") && (
            <Confetti width={1920} height={1080} />
          )}
          <Input
            placeholder="Заголовок стадии..."
            backgroundColor="white"
            opacity="0.75"
            _dark={{
              backgroundColor: "black",
              opacity: "0.75",
            }}
            defaultValue={data?.title}
            onChange={(event) => editTitleInStore(event.target.value)}
          />
          <Input
            placeholder="Ссылка на фон..."
            backgroundColor="white"
            opacity="0.75"
            defaultValue={data?.background}
            mt={2}
            _dark={{
              backgroundColor: "black",
              opacity: "0.75",
            }}
            onChange={(event) => {
              editBackgroundInStore(event.target.value);
              setRerender(!rerender);
            }}
          />
        </Box>
      </Box>
      <Box p={2} my={2} backgroundColor="gray.100" borderRadius="10px">
        <Flex mb={1} alignItems="center">
          <b>Тексты:</b>
          <Box m="auto" />
          <Button
            size="xs"
            colorScheme="teal"
            onClick={() => {
              newTextToStore();
              setRerender(!rerender);
            }}
          >
            +
          </Button>
        </Flex>
        <Box display="grid" gap={1}>
          {storeStage?.texts?.map(
            (text: any, index: number) =>
              text.text && (
                <Textarea
                  key={index}
                  placeholder="Текст..."
                  defaultValue={text.text}
                  backgroundColor="white"
                  onClick={(event: any) => {
                    event.target.style.height = "inherit";
                    event.target.style.height = `${event.target.scrollHeight}px`;
                  }}
                  onInput={(event: any) => {
                    event.target.style.height = "inherit";
                    event.target.style.height = `${event.target.scrollHeight}px`;

                    editTextInStore(index, {
                      text: event.target.value,
                      condition: text.condition,
                    });
                  }}
                />
              )
          )}
        </Box>
      </Box>
      <Box p={2} my={2} backgroundColor="gray.100" borderRadius="10px">
        <b>Сообщение:</b>
        <Box>
          Показывать сообщение:{" "}
          <input
            type="checkbox"
            onClick={(event: any) => {
              event.target.style.height = "inherit";
              event.target.style.height = `${event.target.scrollHeight}px`;
            }}
            onInput={(event: any) => {
              event.target.style.height = "inherit";
              event.target.style.height = `${event.target.scrollHeight}px`;
              setCheckBoxMessage(!checkBoxMessage);
              if (!checkBoxMessage) editMessageInStore("Новое уведомление");
              if (checkBoxMessage) editMessageInStore("");
            }}
            checked={storeStage?.message}
          />
          {storeStage?.message && (
            <Textarea
              placeholder="Уведомление..."
              defaultValue={data?.message}
              backgroundColor="white"
              onChange={(event) => editMessageInStore(event.target.value)}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
