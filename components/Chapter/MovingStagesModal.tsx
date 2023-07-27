import { FC, useEffect, useState } from "react";
import { pointType } from "@/store/types/mapType";
import { chapterType, stageType } from "@/store/types/types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Select,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  points?: pointType[];
  stages?: stageType[];
  currentStory?: string;
  currentChapter?: string;
}

const MovingStagesModal: FC<Props> = ({
  isOpen,
  onClose,
  points,
  stages,
  currentStory,
  currentChapter,
}) => {
  const [chapters, setChapters] = useState<chapterType[]>([]);
  const [targetChapter, setTargetChapter] = useState<number>(0);

  useEffect(() => {
    for (let i = 0; i < localStorage.length; i++) {
      let key: string = localStorage.key(i) as string;
      if (key.includes(`story_${currentStory}_chapter`)) {
        const value: chapterType = JSON.parse(
          localStorage.getItem(key) as string
        ) as chapterType;

        if (value.id !== Number(currentChapter))
          setChapters((prevChapters) => [...prevChapters, value]);
      }
    }
  }, []);

  useEffect(() => {
    setTargetChapter(chapters![0]?.id);
  }, [chapters]);

  const movingStages = () => {
    const keyCurrentChapterJs = `story_${currentStory}_chapter_${currentChapter}`;
    const keyTargetChapterJs = `story_${currentStory}_chapter_${targetChapter}`;
    const currentChapterJs = JSON.parse(
      localStorage.getItem(keyCurrentChapterJs) as string
    ) as chapterType;
    const targetChapterJs = JSON.parse(
      localStorage.getItem(keyTargetChapterJs) as string
    ) as chapterType;

    let maxId =
      Math.max(...targetChapterJs.stages.map((stage) => stage.id)) + 1;
    if (maxId === -Infinity) {
      maxId = 0;
    }

    const stagesCopy = JSON.parse(JSON.stringify(stages)) as stageType[];
    const pointsCopy = JSON.parse(JSON.stringify(points)) as pointType[];

    let map = new Map();

    for (let i = 0; i < stagesCopy.length; i++) {
      const stage = stagesCopy[i];
      map.set(+stage.id, maxId + i);
    }

    for (let i = 0; i < stagesCopy.length; i++) {
      const stage = stagesCopy[i];
      const newId = map.get(stage.id);
      stage.id = newId;
      if (stage.transfers) {
        for (let i = 0; i < stage?.transfers?.length; i++) {
          const transfer = stage.transfers[i];
          const newId = map.get(+transfer.stage);
          transfer.stage = newId;
        }
      }
    }
    targetChapterJs.stages.push(...stagesCopy);
    if (targetChapterJs?.points) {
      pointsCopy.map((point) => {
        const mapId: `${number}` = point.mapId as `${number}`;
        point.data.chapter = String(targetChapterJs.id);
        point.data.stage = map.get(+point.data.stage);

        if (targetChapterJs?.points![mapId]) {
          delete point.mapId;
          targetChapterJs?.points[mapId].push(point);
        } else {
          delete point.mapId;
          targetChapterJs!.points![mapId] = [point];
        }
      });
    }

    // удаляем всё со старой главы

    currentChapterJs.stages = currentChapterJs.stages.filter((stage) => {
      return !stages?.map((stage) => +stage.id).includes(+stage.id);
    });

    points?.map((point) => {
      const mapId: `${number}` = point.mapId as `${number}`;

      currentChapterJs!.points![mapId] = currentChapterJs!.points![
        mapId
      ].filter((pointFilter) => pointFilter.id !== point.id);
    });

    console.log("targetChapter:", targetChapterJs);
    console.log("initChapter:", currentChapterJs);

    localStorage.setItem(keyCurrentChapterJs, JSON.stringify(currentChapterJs));
    localStorage.setItem(keyTargetChapterJs, JSON.stringify(targetChapterJs));
    location.reload();
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Перенос стадий в другую главу</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={2}>
            ВЫ УВЕРЕНЫ ЧТО ХОТИТЕ ПЕРЕНЕСТИ {stages?.length} СТАДИЙ И{" "}
            {points?.length} ТОЧЕК В ДРУГУЮ ГЛАВУ? ЭТО ДЕЙСТВИЕ НЕЛЬЗЯ ОТМЕНИТЬ!
          </Box>
          <Box mb={2}>
            Убедитесь что выбрали все нужные стадии и точки, также проверьте
            чтобы другие стадии не ссылались на выбранные вами стадии.
          </Box>
          <Box>
            <Select
              value={targetChapter}
              onChange={(e) => setTargetChapter(+e.target.value)}
            >
              {chapters
                .sort((chapter) => chapter.id)
                .map((chapter) => (
                  <option value={chapter.id} key={chapter.id}>
                    Глава {chapter.id}
                    {!!chapter.title && `: ${chapter.title}`}
                  </option>
                ))}
            </Select>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              console.log(targetChapter);
              onClose();
            }}
          >
            Закрыть
          </Button>
          <Button
            colorScheme="teal"
            ml={2}
            onClick={() => {
              movingStages();
              onClose();
            }}
          >
            Перенести
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MovingStagesModal;
