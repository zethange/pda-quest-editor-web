import React, { FC } from "react";
import { Box, Input, Select } from "@chakra-ui/react";
import { itemsContainerType, itemType } from "@/store/types/itemsType";
import { groupItem } from "@/store/utils/groupItem";

interface Props {
  value: string;
  onChange: (e: string) => void;
  data: itemsContainerType | undefined;
}

const Item: FC<Props> = ({ value, onChange, data }) => {
  const itemId = value.split(":")[0];
  const quantity = value.split(":")[1];
  console.log({ itemId, quantity });

  const onChangeItemId = (newItemId: string) => {
    onChange(`${newItemId}:${quantity}`);
  };

  const onChangeQuantity = (newQuantity: string) => {
    onChange(`${itemId}:${newQuantity}`);
  };

  return (
    <Box display="flex" w="100%" gap={1}>
      <Select
        flex={4}
        value={itemId}
        onChange={(e) => onChangeItemId(e.target.value)}
      >
        {data &&
          Object.entries(data as itemsContainerType).map(
            (category: [string, itemType[]]) => (
              <optgroup key={category[0]} label={groupItem(category[0])}>
                {category[1].map((item: itemType) => (
                  <option value={String(item.baseId)}>{item.title}</option>
                ))}
              </optgroup>
            )
          )}
      </Select>
      <Input
        flex={1}
        defaultValue={quantity}
        placeholder="Количество..."
        onChange={(e) => onChangeQuantity(e.target.value)}
      />
    </Box>
  );
};

export default Item;
