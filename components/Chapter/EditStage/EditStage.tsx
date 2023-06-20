import React, { useState } from "react";
import { Box, Button, Checkbox, Flex, Input, Textarea } from "@chakra-ui/react";
import { stageText } from "@/store/types/types";
import { useDispatch, useSelector } from "react-redux";
import {
  editBackgroundInStore,
  editMessageInStore,
  editTextInStore,
  editTitleInStore,
  newTextInStore,
} from "@/store/reduxStore/stageSlice";

export default function EditStage() {
  const [checkBoxMessage, setCheckBoxMessage] = useState<boolean>(false);
  const storeStage = useSelector((state: any) => state.stage.stage);
  const dispatch = useDispatch();

  let background: string;
  if (storeStage.background.includes("http")) {
    background = storeStage.background;
  } else if (!storeStage.background) {
    background = "/no_background.png";
  } else {
    background = `https://cdn.artux.net/static/${storeStage.background}`;
  }

  return (
    <>
      <Box
        p={2}
        background={`
            url(${background})
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
          <Input
            placeholder="Заголовок стадии..."
            backgroundColor="white"
            opacity="0.75"
            _dark={{
              backgroundColor: "black",
              opacity: "0.75",
            }}
            defaultValue={storeStage?.title}
            onChange={(event) => dispatch(editTitleInStore(event.target.value))}
          />
          <Input
            placeholder="Ссылка на фон..."
            backgroundColor="white"
            opacity="0.75"
            defaultValue={storeStage?.background}
            mt={2}
            _dark={{
              backgroundColor: "black",
              opacity: "0.75",
            }}
            onChange={(event) => {
              dispatch(editBackgroundInStore(event.target.value));
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
              dispatch(newTextInStore({}));
            }}
          >
            +
          </Button>
        </Flex>
        <Box display="grid" gap={1}>
          {storeStage?.texts?.map((text: stageText, index: number) => (
            <Textarea
              key={index}
              placeholder="Текст..."
              defaultValue={text.text}
              backgroundColor="white"
              onClick={(event) => {
                (event.target as HTMLTextAreaElement).style.height = "inherit";
                (event.target as HTMLTextAreaElement).style.height = `${
                  (event.target as HTMLTextAreaElement).scrollHeight
                }px`;
              }}
              onInput={(event) => {
                (event.target as HTMLTextAreaElement).style.height = "inherit";
                (event.target as HTMLTextAreaElement).style.height = `${
                  (event.target as HTMLTextAreaElement).scrollHeight
                }px`;

                dispatch(
                  editTextInStore({
                    id: index,
                    text: {
                      text: (event.target as HTMLTextAreaElement).value,
                      condition: text.condition,
                    },
                  })
                );
              }}
            />
          ))}
        </Box>
      </Box>
      <Box p={2} my={2} backgroundColor="gray.100" borderRadius="10px">
        <b>Сообщение:</b>
        <Box>
          Показывать сообщение:{" "}
          <Checkbox
            size="sm"
            mt={2}
            onChange={() => {
              setCheckBoxMessage(!checkBoxMessage);
              if (!checkBoxMessage)
                dispatch(editMessageInStore("Новое уведомление"));
              if (checkBoxMessage) dispatch(editMessageInStore(""));
            }}
            defaultChecked={storeStage?.message}
          />
          {storeStage?.message && (
            <Textarea
              placeholder="Уведомление..."
              defaultValue={storeStage?.message}
              backgroundColor="white"
              onClick={(event: any) => {
                event.target.style.height = "inherit";
                event.target.style.height = `${event.target.scrollHeight}px`;
              }}
              onChange={(event) => {
                event.target.style.height = "inherit";
                event.target.style.height = `${event.target.scrollHeight}px`;
                dispatch(editMessageInStore(event.target.value));
              }}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
