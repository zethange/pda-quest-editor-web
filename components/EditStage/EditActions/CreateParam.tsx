import { newParamInAction } from "@/store/store";
import { useState } from "react";
import { Box, Button, Grid, Input, Select, Spacer } from "@chakra-ui/react";

type Props = {
  data: any;
  isLoading: boolean;
  indexAction: any;
  setRerender: () => void;
};

export default function CreateParam({
  data,
  isLoading,
  indexAction,
  setRerender,
}: Props) {
  const [showCreateParam, setShowCreateParam] = useState<boolean>(false);

  const arrParam: string[] = ["68", "1"];
  const onChangeNewParam = (message: string, type: string) => {
    if (type === "item") arrParam[0] = message;
    if (type === "count") arrParam[1] = message;
    console.log(arrParam.join(":"));
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
        <Box backgroundColor="white" display="flex" gap={1}>
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
      )}
    </>
  );
}
