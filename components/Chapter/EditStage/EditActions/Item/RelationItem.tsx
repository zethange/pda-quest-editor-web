import { FC } from "react";
import { Box, Input, Select } from "@chakra-ui/react";

interface Props {
  value: string;
  onChange: (e: string) => void;
}

const groups = [
  ["relation_0", "Одиночки"],
  ["relation_1", "Бандиты"],
  ["relation_2", "Военные"],
  ["relation_3", "Свобода"],
  ["relation_4", "Долг"],
  ["relation_5", "Монолит"],
  ["relation_6", "Наёмники"],
  ["relation_7", "Учёные"],
  ["relation_8", "Чистое небо"],
];

const RelationItem: FC<Props> = ({ value, onChange }) => {
  const group = value.split(":")[0];
  const quantity = value.split(":")[1];

  const onChangeCustom = ({
    newGroup,
    newQuantity,
  }: {
    newGroup?: string;
    newQuantity?: string;
  }) => {
    if (newGroup) {
      onChange(`${newGroup || "relation_1"}:${quantity || "1"}`);
    }
    if (newQuantity) {
      onChange(`${group || "relation_1"}:${newQuantity || "1"}`);
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Select
        flex="4"
        value={group}
        onChange={(e) => {
          onChangeCustom({
            newGroup: e.target.value,
          });
        }}
      >
        {groups.map((group) => (
          <option value={group[0]} key={group[0]}>
            {group[1]}
          </option>
        ))}
      </Select>
      <Input
        value={quantity}
        flex={1}
        placeholder="1..."
        onChange={(e) => {
          onChangeCustom({
            newQuantity: e.target.value,
          });
        }}
      />
    </Box>
  );
};

export default RelationItem;
