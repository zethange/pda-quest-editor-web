import { useChapterEditorStore } from "@/entities/chapter-editor";
import { AutocompleteInput } from "@/shared/ui";
import { Flex, IconButton } from "@chakra-ui/react";
import { FC } from "react";
import { MdRemove } from "react-icons/md";
import { ConditionProps } from "..";

const ParameterCondition: FC<ConditionProps> = ({
  value,
  onChange,
  onDelete,
}) => {
  const { parameters } = useChapterEditorStore();

  return (
    <Flex justifyContent="space-between" mt={1} gap={2}>
      <AutocompleteInput
        value={value[0]}
        onChange={(value) => {
          onChange([value]);
        }}
        parameters={parameters}
      />
      {/* <Input
        value={value}
        bg="white"
        onChange={({ target: { value } }) => {
          onChange([value]);
        }}
      /> */}
      <IconButton
        icon={<MdRemove />}
        aria-label="Удалить значение"
        colorScheme="teal"
        onClick={() => {
          onDelete();
        }}
      />
    </Flex>
  );
};

export { ParameterCondition };
