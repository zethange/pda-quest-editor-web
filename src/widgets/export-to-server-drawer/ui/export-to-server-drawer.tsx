import { IConfigExport, useStoryStore } from "@/entities/story";
import { API_URL } from "@/shared/config";
import { chapterType } from "@/store/types/story/chapterType";
import { mapType } from "@/store/types/story/mapType";
import { logger } from "@/shared/lib/logger.ts";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Text,
  Tooltip,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FC } from "react";
import store from "store2";

export interface ExportToServerDrawerProps {
  exportDrawerOnClose: () => void;
  isOpen: boolean;
}

const ExportToServerDrawer: FC<ExportToServerDrawerProps> = ({
  exportDrawerOnClose,
  isOpen,
}) => {
  const { uploadConfig, setUploadConfig } = useStoryStore();
  const toast = useToast();

  const resetParametersUpload = () => {
    setUploadConfig({
      id: 0,
      type: "PUBLIC",
      toStore: false,
      message: "",
    });
  };

  const uploadStoryToServer = async (storyId: number) => {
    const info = await store.get(`story_${storyId}_info`);
    logger.info("Started upload to server, info:", info);

    let chapters: chapterType[] = [];
    let maps: mapType[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i) as string;
      const value = localStorage.getItem(key!);
      if (key?.includes(`story_${storyId}_chapter`)) {
        chapters.push(JSON.parse(value as string) as unknown as chapterType);
      }
      if (key?.includes(`story_${storyId}_map`)) {
        maps.push(JSON.parse(value as string) as unknown as mapType);
      }
    }

    const data = {
      ...info,
      needs: [0],
      chapters,
      maps,
    };
    logger.info("History is formed", data);
    if (!uploadConfig.toStore) {
      var res = await fetch(
        API_URL +
          `/api/v1/admin/quest/set${
            uploadConfig.type === "PUBLIC" ? "/public" : ""
          }?message=${uploadConfig.message}`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
    } else {
      // грузим в хранилище
      var res = await fetch(
        API_URL +
          `/api/v1/admin/quest/storage/upload?message=${uploadConfig.message}&type=${uploadConfig.type}`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
    }

    const dataRes = await res.json();

    if (res.status === 200) {
      toast({
        colorScheme: "green",
        title: "История отправлена успешно",
        description: dataRes.description,
      });
    } else {
      toast({
        colorScheme: "red",
        title: "Произошла ошибка, подробнее в devtools",
        description: dataRes.description,
      });
    }
    logger.success("Ответ:", dataRes);
    resetParametersUpload();
  };

  return (
    <Drawer
      placement="right"
      size="md"
      onClose={exportDrawerOnClose}
      isOpen={isOpen}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          Загрузка истории на сервер
        </DrawerHeader>
        <DrawerBody>
          <VStack gap={2}>
            <FormControl
              background="gray.100"
              _dark={{ background: "gray.600" }}
              borderRadius={10}
              p={2}
            >
              <Text>Загрузить как:</Text>
              <RadioGroup
                value={uploadConfig.type}
                onChange={(value) => {
                  setUploadConfig({
                    type: value,
                  } as Pick<IConfigExport, "type">);
                }}
              >
                <Stack direction="row">
                  <Radio value="PUBLIC">Публичную историю</Radio>
                  <Radio value="PRIVATE">Пользовательскую историю</Radio>
                  {uploadConfig.toStore && (
                    <Radio value="COMMUNITY">Историю от комьюнити</Radio>
                  )}
                </Stack>
              </RadioGroup>
            </FormControl>
            <FormControl
              p={2}
              background="gray.100"
              _dark={{ background: "gray.600" }}
              borderRadius={10}
            >
              <Stack direction="row">
                <Text>Загрузить в хранилище?</Text>
                <Switch
                  pt={1}
                  checked={uploadConfig.toStore}
                  onChange={(e) => {
                    setUploadConfig({
                      toStore: Boolean(e.target.checked),
                    });
                  }}
                />
              </Stack>
            </FormControl>
            <FormControl
              p={2}
              background="gray.100"
              _dark={{ background: "gray.600" }}
              borderRadius={10}
            >
              <Tooltip
                label="Сам честно не понимаю зачем оно"
                placement="auto-start"
              >
                <Text>Сообщение:</Text>
              </Tooltip>
              <Input
                value={uploadConfig.message}
                background="white"
                _dark={{
                  background: "gray.700",
                }}
                placeholder="Сообщение..."
                onChange={(e) => {
                  setUploadConfig({
                    message: e.target.value,
                  });
                }}
              />
            </FormControl>
          </VStack>
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button
            variant="outline"
            mr={3}
            onClick={() => {
              exportDrawerOnClose();
              resetParametersUpload();
            }}
          >
            Закрыть
          </Button>
          <Button
            colorScheme="teal"
            onClick={() => {
              exportDrawerOnClose();
              uploadStoryToServer(uploadConfig.id);
            }}
          >
            Загрузить
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ExportToServerDrawer;
