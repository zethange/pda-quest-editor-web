import { FC } from "react";
import { Card, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";
import { chapterType } from "@/store/types/story/chapterType";

interface Props {
  storyId: string;
  chapter: chapterType;
  setOpenChapter: (chapter: chapterType) => void;
  onOpen: () => void;
}

const ChapterCard: FC<Props> = ({
  chapter,
  storyId,
  setOpenChapter,
  onOpen,
}) => {
  return (
    <Card
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("application/json", JSON.stringify(chapter));
      }}
      border="1px"
      borderColor="gray.200"
      _dark={{
        borderColor: "gray.600",
        color: "white",
      }}
      shadow="none"
      p={2}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Link href={"/edit/chapter/" + storyId + "/" + chapter?.id}>
          {(chapter?.title && (
            <>
              <Heading _dark={{ color: "white" }} as="h4" size="md">
                {chapter?.title}
              </Heading>
              <Text color="gray.500">id: {chapter?.id}</Text>
            </>
          )) || (
            <Heading _dark={{ color: "white" }} as="h4" size="md">
              Глава {chapter?.id}
            </Heading>
          )}
        </Link>
        <IconButton
          onClick={() => {
            setOpenChapter(chapter);
            onOpen();
          }}
          icon={<BsThreeDotsVertical />}
          aria-label="Настройки"
        />
      </Flex>
      {chapter?._comment && (
        <Text
          p={1}
          fontSize="13px"
          backgroundColor="gray.200"
          borderRadius="5px"
          mt={1}
          width="100%"
          wordBreak="break-all"
        >
          # {chapter?._comment}
        </Text>
      )}
      <Text _dark={{ color: "white" }}>
        Количество стадий: {chapter?.stages?.length}
      </Text>
      {chapter?.points && (
        <Text _dark={{ color: "white" }}>
          Количество точек: {Object.values(chapter?.points!).flat().length}
        </Text>
      )}
      {chapter?.spawns && (
        <Text _dark={{ color: "white" }}>
          Количество спавнов: {Object.values(chapter?.spawns!).flat().length}
        </Text>
      )}
    </Card>
  );
};

export default ChapterCard;
