import { useState } from "react";
import { Box, Button, Input, Select, Spacer } from "@chakra-ui/react";
import { fetcher } from "@/store/tools";
import { groupItem } from "@/store/utils/groupItem";
import { newParamInMethod } from "@/store/reduxStore/stageSlice";
import { useDispatch } from "react-redux";
import useFetching from "@/hooks/useFetching";
import { itemsContainerType, itemType } from "@/store/types/itemsType";

type Props = {
  indexAction: any;
  type: string;
};

function Empty({
  onChangeNewParam,
  setShowCreateParam,
  indexAction,
  newParam,
}: any) {
  const dispatch = useDispatch();

  return (
    <Box display="flex" gap={1} mb={1}>
      <Input
        placeholder="Параметр..."
        required={true}
        defaultValue={""}
        onChange={(event) => onChangeNewParam(event.target.value)}
      />
      <Button
        fontWeight="normal"
        onClick={() => {
          dispatch(
            newParamInMethod({ indexMethod: indexAction, param: newParam })
          );
          setShowCreateParam(false);
        }}
      >
        Сохранить
      </Button>
    </Box>
  );
}

function WithItems({ indexAction, setShowCreateParam }: any) {
  const { data, isLoading } = useFetching<itemsContainerType>(
    "/pdanetwork/api/v1/items/all"
  );
  const dispatch = useDispatch();

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
        {!isLoading &&
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
          dispatch(
            newParamInMethod({
              indexMethod: indexAction,
              param: arrParam.join(":"),
            })
          );
          setShowCreateParam(false);
        }}
      >
        Сохранить
      </Button>
    </Box>
  );
}

export default function CreateParamEmpty({ indexAction, type }: Props) {
  const [showCreateParam, setShowCreateParam] = useState<boolean>(false);
  const [newParam, setNewParam] = useState("");
  const [typeCreate, setTypeCreate] = useState(true);

  const onChangeNewParam = (param: string) => {
    setNewParam(param);
  };

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
            />
          )}
          {type === "item" && (
            <Box p={1} my={1} borderRadius="10px" backgroundColor="gray.50">
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
                />
              ) : (
                <WithItems
                  indexAction={indexAction}
                  setShowCreateParam={setShowCreateParam}
                />
              )}
            </Box>
          )}
        </>
      )}
    </>
  );
}
