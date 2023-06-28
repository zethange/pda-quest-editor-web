import React, { useCallback, useState } from "react";
import useFetching from "@/hooks/useFetching";
import CodeMirror from "@uiw/react-codemirror";
import { groupItem } from "@/store/utils/groupItem";
import { StreamLanguage } from "@codemirror/language";
import { lua } from "@codemirror/legacy-modes/mode/lua";
import { itemsContainerType, itemType } from "@/store/types/itemsType";
import { Box, Button, Input, Select, Spacer } from "@chakra-ui/react";
import { useAppSelector } from "@/store/reduxHooks";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

type Props = {
  indexAction: any;
  type: string;
  newParamInMethod: (indexMethod: number, param: string) => void;
};

function Empty({
  onChangeNewParam,
  setShowCreateParam,
  indexAction,
  newParam,
  newParamInMethod,
}: any) {
  const parameters = useAppSelector((state) => state.stage.parameters);

  return (
    <Box display="flex" gap={1} mb={1}>
      <AutoComplete
        openOnFocus
        value={newParam}
        onChange={(value) => {
          onChangeNewParam(value);
        }}
      >
        <AutoCompleteInput
          placeholder="Параметер"
          variant="outline"
          value={newParam}
          onChange={(event) => {
            onChangeNewParam(event.target.value);
          }}
        />
        <AutoCompleteList>
          {parameters.map((parameter, index) => (
            <AutoCompleteItem
              key={index}
              value={parameter}
              textTransform="none"
            >
              {parameter}
            </AutoCompleteItem>
          ))}
        </AutoCompleteList>
      </AutoComplete>
      <Button
        fontWeight="normal"
        onClick={() => {
          newParamInMethod(indexAction, newParam);
          setShowCreateParam(false);
        }}
      >
        Сохранить
      </Button>
    </Box>
  );
}

function WithItems({ indexAction, setShowCreateParam, newParamInMethod }: any) {
  const { data } = useFetching<itemsContainerType>(
    "/pdanetwork/api/v1/items/all"
  );

  const arrParam: string[] = ["68", "1"];
  const onChangeNewParam = (message: string, type: "item" | "count") => {
    if (type === "item") arrParam[0] = message;
    if (type === "count") arrParam[1] = message;
    console.log(arrParam.join(":"));
  };

  return (
    <Box display="flex" gap={1} mb={1}>
      <Select
        size="md"
        name="select"
        onChange={(event) => onChangeNewParam(event.target.value, "item")}
        required={true}
        defaultValue={arrParam[0]}
      >
        {data &&
          Object.entries(data as itemsContainerType).map(
            (category: [string, itemType[]]) => (
              <optgroup label={groupItem(category[0])}>
                {category[1].map((item: itemType) => (
                  <option value={item.baseId}>{item.title}</option>
                ))}
              </optgroup>
            )
          )}
      </Select>
      <Input
        placeholder="Количество"
        required={true}
        width="70px"
        defaultValue={arrParam[1]}
        onChange={(event) => onChangeNewParam(event.target.value, "count")}
      />
      <Button
        fontWeight="normal"
        onClick={() => {
          newParamInMethod(indexAction, arrParam.join(":"));
          setShowCreateParam(false);
        }}
      >
        Сохранить
      </Button>
    </Box>
  );
}

function WithCodeMirror({
  onChangeNewParam,
  setShowCreateParam,
  indexAction,
  newParam,
  newParamInMethod,
}: any) {
  const onChange = useCallback((value: string) => {
    onChangeNewParam(value);
  }, []);

  return (
    <Box display="grid" gap={1} mb={1}>
      <CodeMirror
        placeholder="скрипт"
        height="200px"
        extensions={[StreamLanguage.define(lua)]}
        onChange={onChange}
      />
      <Button
        fontWeight="normal"
        onClick={() => {
          newParamInMethod(indexAction, newParam);
          setShowCreateParam(false);
        }}
      >
        Сохранить
      </Button>
    </Box>
  );
}

export default function CreateParamEmpty({
  indexAction,
  type,
  newParamInMethod,
}: Props) {
  const [showCreateParam, setShowCreateParam] = useState<boolean>(false);
  const [newParam, setNewParam] = useState("");
  const [typeCreate, setTypeCreate] = useState(true);

  const onChangeNewParam = (param: string) => {
    setNewParam(param);
  };

  if (type !== "null") {
    return (
      <>
        <Box display="flex" my={1}>
          Значения:
          <Spacer />
          <Button
            size="xs"
            py={1}
            onClick={() => {
              setShowCreateParam(!showCreateParam);
            }}
          >
            {showCreateParam ? "-" : "+"}
          </Button>
        </Box>
        {showCreateParam && (
          <>
            {type === "empty" && (
              <Empty
                onChangeNewParam={onChangeNewParam}
                setShowCreateParam={setShowCreateParam}
                indexAction={indexAction}
                newParam={newParam}
                newParamInMethod={newParamInMethod}
              />
            )}
            {type === "codemirror" && (
              <WithCodeMirror
                onChangeNewParam={onChangeNewParam}
                setShowCreateParam={setShowCreateParam}
                indexAction={indexAction}
                newParam={newParam}
                newParamInMethod={newParamInMethod}
              />
            )}
            {type === "item" && (
              <Box
                p={1}
                my={1}
                borderRadius="10px"
                backgroundColor="gray.50"
                _dark={{
                  backgroundColor: "gray.700",
                }}
              >
                <Button
                  fontWeight="normal"
                  onClick={() => setTypeCreate(!typeCreate)}
                  mb={1}
                  w="100%"
                >
                  {typeCreate ? "Параметр" : "Предмет"}
                </Button>
                {typeCreate ? (
                  <Empty
                    onChangeNewParam={onChangeNewParam}
                    setShowCreateParam={setShowCreateParam}
                    indexAction={indexAction}
                    newParam={newParam}
                    newParamInMethod={newParamInMethod}
                  />
                ) : (
                  <WithItems
                    indexAction={indexAction}
                    setShowCreateParam={setShowCreateParam}
                    newParamInMethod={newParamInMethod}
                  />
                )}
              </Box>
            )}
          </>
        )}
      </>
    );
  } else {
    return <Box></Box>;
  }
}
