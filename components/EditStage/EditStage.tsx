import deleteConditionInTransfer, {
  createValueInCondition,
  deleteValueInCondition,
  editBackgroundInStore,
  editMessageInStore,
  editTextInStore,
  editTitleInStore,
  editTransferInStore,
  editValueInConditions,
  storeStage,
} from "@/store/store";
import { useState } from "react";
import CreateConditionInTransferJsx from "./CreateConditionInTransfer";
import {
  Box,
  Button,
  Flex,
  Input,
  ListItem,
  Textarea,
  UnorderedList,
} from "@chakra-ui/react";

export default function EditStage({ data }: { data: any }) {
  const [rerender, setRerender] = useState<boolean>(false);
  const [checkBoxMessage, setCheckBoxMessage] = useState<boolean>(false);

  return (
    <>
      <Box p={2} backgroundColor="gray.100" borderRadius="10px">
        <Box>
          <Input
            placeholder="Заголовок стадии..."
            backgroundColor="white"
            mb={2}
            defaultValue={data?.title}
            onChange={(event) => editTitleInStore(event.target.value)}
          />
          <img
            src={
              storeStage?.background_url
                ? `https://files.artux.net/static/${data?.background_url}`
                : "/no_background.png"
            }
            alt=""
            width="340px"
            style={{ borderRadius: "5px" }}
          />
          <Input
            placeholder="Ссылка на фон..."
            backgroundColor="white"
            defaultValue={data?.background_url}
            mt={2}
            onChange={(event) => {
              editBackgroundInStore(event.target.value);
              setRerender(!rerender);
            }}
          />
        </Box>
      </Box>
      <Box p={2} my={2} backgroundColor="gray.100" borderRadius="10px">
        <b>Сообщение:</b>
        <Box>
          Показывать сообщение:{" "}
          <input
            type="checkbox"
            onChange={() => {
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
      <Box p={2} my={2} backgroundColor="gray.100" borderRadius="10px">
        <Flex mb={1} alignItems="center">
          <b>Тексты:</b>
          <Box m="auto" />
          <Button size="xs" colorScheme="teal">
            +
          </Button>
        </Flex>
        {storeStage?.texts?.map(
          (text: any, index: number) =>
            text.text && (
              <Box key={index}>
                <Textarea
                  placeholder="Текст..."
                  defaultValue={text.text}
                  backgroundColor="white"
                  onChange={(event) =>
                    editTextInStore(index, {
                      text: event.target.value,
                      condition: text.condition,
                    })
                  }
                />
              </Box>
            )
        )}
      </Box>
      <Box p={2} my={2} backgroundColor="gray.100" borderRadius="10px">
        <b>Ответы:</b>
        {storeStage?.transfers?.map(
          (transfer: any, index: number) =>
            transfer.text && (
              <Box key={index}>
                <Textarea
                  placeholder="Ответ..."
                  defaultValue={transfer.text}
                  backgroundColor="white"
                  onChange={(event) =>
                    editTransferInStore(index, {
                      text: event.target.value,
                      stage_id: transfer.stage_id,
                      condition: transfer.condition,
                    })
                  }
                />
                <CreateConditionInTransferJsx
                  transferIndex={index}
                  functionAdd={() => setRerender(!rerender)}
                />
                {Object.entries(storeStage.transfers[index].condition).map(
                  (condition: any, conditionIndex: number) => (
                    <Box
                      key={conditionIndex}
                      backgroundColor="white"
                      p={2}
                      my={1}
                      borderRadius={5}
                    >
                      <Box display="flex">
                        Если
                        {condition[0] === "has"
                          ? " есть параметр:"
                          : " нет параметра:"}
                        <Box mx="auto" />
                        <button
                          style={{ marginRight: "4px" }}
                          onClick={() => {
                            deleteConditionInTransfer(index, conditionIndex);
                            setRerender(!rerender);
                          }}
                        >
                          Удалить
                        </button>
                        <button
                          onClick={() => {
                            createValueInCondition(index, conditionIndex);
                            setRerender(!rerender);
                          }}
                        >
                          +
                        </button>
                      </Box>
                      <UnorderedList>
                        {condition[1].map(
                          (conditionValue: any, valueIndex: number) => (
                            <ListItem key={valueIndex}>
                              <input
                                type="text"
                                defaultValue={conditionValue}
                                onChange={(event) => {
                                  editValueInConditions(
                                    index,
                                    conditionIndex,
                                    valueIndex,
                                    event.target.value
                                  );
                                }}
                              />
                              <button
                                onClick={() => {
                                  deleteValueInCondition(
                                    index,
                                    conditionIndex,
                                    valueIndex
                                  );
                                  setRerender(!rerender);
                                }}
                              >
                                -
                              </button>
                            </ListItem>
                          )
                        )}
                      </UnorderedList>
                    </Box>
                  )
                )}
              </Box>
            )
        )}
      </Box>
    </>
  );
}
