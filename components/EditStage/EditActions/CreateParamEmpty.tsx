import { newParamInAction } from "@/store/store";
import { useState } from "react";
import { Box, Button, Input, Select, Spacer } from "@chakra-ui/react";
import useSWR from "swr";
import { fetcher } from "@/store/tools";

type Props = {
  indexAction: any;
  type: string;
  setRerender: () => void;
};

function Empty({
  onChangeNewParam,
  setShowCreateParam,
  setRerender,
  indexAction,
  newParam,
}: any) {
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
          newParamInAction(indexAction, newParam);
          setShowCreateParam(false);
          setRerender();
        }}
      >
        Сохранить
      </Button>
    </Box>
  );
}

function WithItems({ indexAction, setRerender }: any) {
  const { data, isLoading } = useSWR("/pdanetwork/items/all", fetcher);

  const [showCreateParam, setShowCreateParam] = useState<boolean>(false);

  const arrParam: string[] = ["68", "1"];
  const onChangeNewParam = (message: string, type: string) => {
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
          Object.entries(data).map((category: any) => (
            <optgroup label={category[0]}>
              {category[1].map((item: any) => (
                <option value={item.baseId}>{item.title}</option>
              ))}
            </optgroup>
          ))}
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
          newParamInAction(indexAction, arrParam.join(":"));
          setShowCreateParam(false);
          setRerender();
        }}
      >
        Сохранить
      </Button>
    </Box>
  );
}

export default function CreateParamEmpty({
  indexAction,
  setRerender,
  type,
}: Props) {
  const [showCreateParam, setShowCreateParam] = useState<boolean>(false);
  const [newParam, setNewParam] = useState("");
  const [typeCreate, setTypeCreate] = useState(true);

  const onChangeNewParam = (param: string) => {
    setNewParam(param);
  };
  console.log(type);

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
              setRerender={setRerender}
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
                {typeCreate ? "Добавить предмет" : "Добавить параметр"}
              </Button>
              {typeCreate ? (
                <>
                  <Empty
                    onChangeNewParam={onChangeNewParam}
                    setShowCreateParam={setShowCreateParam}
                    setRerender={setRerender}
                    indexAction={indexAction}
                    newParam={newParam}
                  />
                </>
              ) : (
                <>
                  <WithItems
                    indexAction={indexAction}
                    setRerender={setRerender}
                  />
                </>
              )}
            </Box>
          )}
        </>
      )}
    </>
  );
}
