import { useChapterEditorStore } from "@/entities/chapter-editor";
import { useStageStore } from "@/entities/stage-editor";
import { ChapterType, StageTextType } from "@/shared/lib/type/chapter.type.ts";
import { ConditionEditorModal } from "@/widgets/condition-editor";
import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Input,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";
import { MdDelete, MdLock, MdLockOutline } from "react-icons/md";
import { v4 } from "uuid";

const StageEditor: FC = () => {
  const { chapter, storyId, setChapter } = useChapterEditorStore();
  const { stage, editStage, reset } = useStageStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getUrlImage = (link?: string) => {
    if (!link) return "/no_background.jpg";
    if (link.startsWith("http")) {
      return link;
    } else {
      return `https://cdn.artux.net/static/${link}`;
    }
  };

  if (!stage) return <Box></Box>;
  return (
    <Box
      position="absolute"
      bg="white"
      borderWidth="1px"
      _dark={{ bg: "gray.700" }}
      width="400px"
      height="calc(100% - 12px)"
      rounded="md"
      p={2}
      zIndex={1}
      right={0}
      mt={2}
      mr={2}
      display="grid"
      gap={2}
      alignContent="space-between"
    >
      <Box overflowY="auto">
        <Text fontSize="small">
          {storyId}:{chapter?.id}:{stage.id}
        </Text>
        <Box display="grid" gap={2}>
          {stage.type_stage == 0 && (
            <Box position="relative">
              <Input
                position="absolute"
                bg="white"
                _dark={{ bg: "black" }}
                opacity={0.8}
                zIndex={12}
                value={stage.background}
                bottom={0}
                onChange={({ target: { value } }) =>
                  editStage({ background: value })
                }
              ></Input>
              <Input
                position="absolute"
                bg="white"
                _dark={{ bg: "black" }}
                opacity={0.8}
                zIndex={12}
                value={stage.title}
                onChange={({ target: { value } }) =>
                  editStage({ title: value })
                }
              />
              <AspectRatio ratio={16 / 9}>
                <Image src={getUrlImage(stage?.background)} rounded="md" />
              </AspectRatio>
            </Box>
          )}
          <Box
            p={2}
            my={2}
            backgroundColor="gray.100"
            _dark={{
              backgroundColor: "gray.700",
            }}
            borderRadius="10px"
          >
            <Flex mb={1} alignItems="center">
              <b>Тексты:</b>
              <Box m="auto" />
              <Button
                size="xs"
                colorScheme="teal"
                onClick={() => {
                  editStage({
                    texts: [
                      ...(stage.texts || []),
                      { text: "", condition: {}, _id: v4() },
                    ],
                  });
                }}
              >
                +
              </Button>
            </Flex>
            <Box display="grid" gap={1}>
              {stage.texts?.map((text: StageTextType, index: number) => (
                <Box display="flex" gap={1} key={index}>
                  <Textarea
                    placeholder="Текст..."
                    height="120px"
                    resize="vertical"
                    defaultValue={text.text}
                    backgroundColor="white"
                    _dark={{
                      backgroundColor: "gray.900",
                    }}
                    onChange={({ target: { value } }) => {
                      stage.texts![index].text = value;
                    }}
                  />
                  <VStack gap={1}>
                    <IconButton
                      aria-label="Удалить текст"
                      size="sm"
                      onClick={() => {
                        editStage({
                          texts: stage.texts?.filter((_, i) => i !== index),
                        });
                      }}
                    >
                      <Icon as={MdDelete} />
                    </IconButton>
                    <IconButton
                      aria-label="Редактировать условие"
                      size="sm"
                      onClick={onOpen}
                    >
                      <Icon
                        as={
                          JSON.stringify(text.condition) == "{}"
                            ? MdLockOutline
                            : MdLock
                        }
                      />
                    </IconButton>
                  </VStack>
                  <ConditionEditorModal
                    isOpen={isOpen}
                    onClose={onClose}
                    condition={text.condition}
                    setCondition={(condition) => {
                      console.log(condition);
                      stage.texts![index].condition = condition;
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Flex justifyContent="space-between">
        <Box></Box>
        <Flex gap={1}>
          <Button
            size="sm"
            onClick={() => {
              reset();
            }}
          >
            Закрыть
          </Button>
          <Button
            size="sm"
            colorScheme="teal"
            onClick={() => {
              const copyChapter = JSON.parse(
                JSON.stringify(chapter)
              ) as ChapterType;
              const index = copyChapter.stages.findIndex(
                (s) => s.id === stage.id
              );
              copyChapter.stages[index] = stage;
              setChapter(copyChapter);

              reset();
            }}
          >
            Сохранить
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export { StageEditor };
