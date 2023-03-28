import { newParamInAction } from "@/store/store";
import { useState } from "react";
import { Box, Grid, Select } from "@chakra-ui/react";

type Props = {
  data: any;
  isLoading: boolean;
  indexAction: any;
};

export default function CreateParam({ data, isLoading, indexAction }: Props) {
  const [showCreateParam, setShowCreateParam] = useState<boolean>(false);

  const arrParam: string[] = ["68", "1"];
  const onChangeNewParam = (message: string, type: string) => {
    if (type === "item") arrParam[0] = message;
    if (type === "count") arrParam[1] = message;
    console.log(arrParam.join(":"));
  };

  return (
    <>
      <Box display="flex">
        Значения:
        <Box m="auto" />
        <button
          onClick={() => {
            setShowCreateParam(!showCreateParam);
          }}
        >
          {showCreateParam ? "-" : "+"}
        </button>
      </Box>
      {showCreateParam && (
        <Box backgroundColor="white" p={2} borderRadius={5}>
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
          <input
            style={{ width: "100px" }}
            placeholder="Количество"
            required={true}
            defaultValue={arrParam[1]}
            onChange={(event) => onChangeNewParam(event.target.value, "count")}
          />
          <button
            className="btn"
            onClick={() => {
              newParamInAction(indexAction, arrParam.join(":"));
              setShowCreateParam(false);
            }}
          >
            Сохранить
          </button>
        </Box>
      )}
    </>
  );
}
