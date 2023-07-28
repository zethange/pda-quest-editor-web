import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  Switch,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { stageText } from "@/store/types/types";
import { useDispatch } from "react-redux";
import {
  deleteTextInStore,
  editBackgroundInStore,
  editMessageInStore,
  editStageInStore,
  editTextInStore,
  editTitleInStore,
  newTextInStore,
  setTargetText,
} from "@/store/reduxStore/stageSlice";
import { MdDelete, MdLockOutline } from "react-icons/md";
import EditTextCondition from "@/components/Chapter/EditStage/EditTextCondition";
import { useAppSelector } from "@/store/reduxHooks";

export default function EditStage() {
  const [openCondition, setOpenCondition] = useState<boolean>(false);
  const storeStage = useAppSelector((state) => state.stage.stage);
  const dispatch = useDispatch();

  let background: string;
  if (storeStage.background?.includes("http")) {
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
        backgroundSize="440px"
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
      <Box
        p={2}
        my={2}
        backgroundColor="gray.100"
        _dark={{
          backgroundColor: "gray.700",
        }}
        borderRadius="10px"
      >
        <Flex mb={1} alignItems="center">
          <b>Тексты:</b>
          <Box m="auto" />
          <Button
            size="xs"
            colorScheme="teal"
            onClick={() => {
              dispatch(newTextInStore());
            }}
          >
            +
          </Button>
        </Flex>
        <Box display="grid" gap={1}>
          {storeStage?.texts?.map((text: stageText, index: number) => (
            <Box display="flex" gap={1} key={index}>
              <Textarea
                placeholder="Текст..."
                defaultValue={text.text}
                backgroundColor="white"
                _dark={{
                  backgroundColor: "gray.900",
                }}
                onClick={(event) => {
                  (event.target as HTMLTextAreaElement).style.height =
                    "inherit";
                  (event.target as HTMLTextAreaElement).style.height = `${
                    (event.target as HTMLTextAreaElement).scrollHeight
                  }px`;
                }}
                onInput={(event) => {
                  (event.target as HTMLTextAreaElement).style.height =
                    "inherit";
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
              <VStack gap={1}>
                <IconButton
                  aria-label="Удалить текст"
                  size="sm"
                  onClick={() => {
                    dispatch(deleteTextInStore(index));
                  }}
                >
                  <Icon as={MdDelete} />
                </IconButton>
                <IconButton
                  aria-label="Редактировать условие"
                  size="sm"
                  onClick={() => {
                    dispatch(
                      setTargetText({
                        targetText: text,
                        indexTargetText: index,
                      })
                    );
                    setOpenCondition(true);
                  }}
                >
                  <Icon as={MdLockOutline} />
                </IconButton>
              </VStack>
            </Box>
          ))}
        </Box>
      </Box>
      <EditTextCondition
        openCondition={openCondition}
        setOpenCondition={setOpenCondition}
      />
      <Box
        p={2}
        my={2}
        backgroundColor="gray.100"
        _dark={{
          backgroundColor: "gray.700",
        }}
        borderRadius="10px"
      >
        <b>Комментарий:</b>
        <Input
          defaultValue={storeStage?._comment}
          backgroundColor="white"
          placeholder="Комментарий..."
          _dark={{
            backgroundColor: "gray.900",
          }}
          onChange={(event) => {
            dispatch(
              editStageInStore({
                _comment: event.target.value,
              })
            );
          }}
        />
      </Box>
      <Box
        p={2}
        my={2}
        backgroundColor="gray.100"
        _dark={{
          backgroundColor: "gray.700",
        }}
        borderRadius="10px"
      >
        <b>Уведомление:</b>
        <Box>
          <Textarea
            placeholder="Уведомление... (если пусто, показыватся не будет)"
            defaultValue={storeStage?.message}
            backgroundColor="white"
            _dark={{
              backgroundColor: "gray.900",
            }}
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
        </Box>
      </Box>
    </>
  );
}
