import { newParamInAction } from "@/store/store";
import { useState } from "react";
import { Box, Button, Input, Spacer } from "@chakra-ui/react";

type Props = {
  data: any;
  isLoading: boolean;
  indexAction: any;
  setRerender: () => void;
};

export default function CreateParamEmpty({
  data,
  isLoading,
  indexAction,
  setRerender,
}: Props) {
  const [showCreateParam, setShowCreateParam] = useState<boolean>(false);
  const [newParam, setNewParam] = useState("");
  console.log(data, isLoading, indexAction);

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
        <Box backgroundColor="white" display="flex" gap={1} mb={1}>
          <Input
            placeholder="Количество"
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
      )}
    </>
  );
}
