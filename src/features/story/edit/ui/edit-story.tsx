import { useStoryStore } from "@/entities/story";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import store from "store2";

export interface EditStoryDrawerProps {
  onClose: () => void;
  isOpen: boolean;
}

const EditStoryDrawer: FC<EditStoryDrawerProps> = ({ isOpen, onClose }) => {
  const { stories, setStories, editStory, setEditStory } = useStoryStore();
  const [isError, setIsError] = useState<boolean>(false);
  const [openStoryIdOld, setOpenStoryIdOld] = useState<number>();

  useEffect(() => setOpenStoryIdOld(editStory?.id), []);

  const checkUniqueId = (storyId: number) => {
    const allIds = stories.map((story) => story.id);
    const exists = allIds.indexOf(storyId) !== -1;

    if (exists && storyId === openStoryIdOld) {
      return false;
    } else {
      return true;
    }
  };

  const saveUpdatedStory = () => {
    const storiesCopy = JSON.parse(JSON.stringify(stories)) as typeof stories;
    if (!editStory) return;
    const indexEditedStory = storiesCopy.findIndex(
      (story) => story.id === editStory.id
    );

    storiesCopy.splice(indexEditedStory, 1, editStory);
    setStories(storiesCopy);

    if (editStory.id !== openStoryIdOld) {
      const requriedUpdate: [string, string][] = [];

      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (!key) continue;

        if (
          key.includes(`story_${openStoryIdOld}_chapter`) ||
          key.includes(`story_${openStoryIdOld}_map`)
        ) {
          const keySplit = key.split("_");
          keySplit[1] = String(editStory?.id);
          requriedUpdate.push([key!, keySplit.join("_")]);
        }
        if (key === `story_${openStoryIdOld}_info`) {
          store.set(`story_${editStory.id}_info`, editStory);
          store.remove(`story_${openStoryIdOld}_info`);
        }
      }
      requriedUpdate.forEach((chapter) => {
        store.set(chapter[1], store.get(chapter[0]));
        store.remove(chapter[0]);
      });
      return;
    }
    store.set(`story_${editStory.id}_info`, editStory);
  };

  const deleteStory = (storyId: number) => {
    const storyItems: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key?.includes(`story_${storyId}`)) {
        storyItems.push(key!);
      }
    }

    storyItems.forEach((storyKey) => {
      store.remove(storyKey);
    });
    location.reload();
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size="md" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Редактирование истории {editStory?.id}
        </DrawerHeader>
        <DrawerBody>
          <Box display="grid" gap={2}>
            <FormControl isInvalid={isError}>
              <FormLabel>ID</FormLabel>
              <Input
                defaultValue={editStory?.id}
                placeholder="ID истории..."
                type="number"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setIsError(checkUniqueId(+e.target.value));
                  setEditStory({
                    id: +e.target.value,
                  });
                }}
              />
              <FormErrorMessage>
                История с таким ID уже существует
              </FormErrorMessage>
            </FormControl>
            <Box>
              <FormLabel>Название</FormLabel>
              <Input
                defaultValue={editStory?.title}
                placeholder="Название истории..."
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEditStory({
                    title: e.target.value,
                  })
                }
              />
            </Box>
            <Box>
              <FormLabel>Описание</FormLabel>
              <Textarea
                defaultValue={editStory?.desc}
                placeholder="Описание истории..."
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setEditStory({
                    desc: e.target.value,
                  })
                }
              />
            </Box>
            <Box>
              <FormLabel>Иконка</FormLabel>
              <Input
                placeholder="Иконка истории..."
                defaultValue={editStory?.icon}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEditStory({
                    icon: e.target.value,
                  })
                }
              />
            </Box>
            <Box>
              <FormLabel>Уровень доступа</FormLabel>
              <Select
                defaultValue={editStory?.access}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setEditStory({
                    ...editStory!,
                    access: e.target.value,
                  })
                }
              >
                <option value="USER">USER</option>
                <option value="TESTER">TESTER</option>
                <option value="MODERATOR">MODERATOR</option>
                <option value="ADMIN">ADMIN</option>
              </Select>
            </Box>
          </Box>
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button
            colorScheme="red"
            mr={3}
            onClick={() => {
              onClose();
              deleteStory(openStoryIdOld as number);
            }}
          >
            Удалить
          </Button>
          <Button variant="outline" mr={3} onClick={onClose}>
            Закрыть
          </Button>
          <Button
            colorScheme="teal"
            onClick={() => {
              if (!isError) {
                saveUpdatedStory();
                onClose();
              }
            }}
          >
            Сохранить
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export { EditStoryDrawer };
