import {
  Box,
  Button,
  Card,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface IConfig {
  server: string;
  type: string;
  archive: boolean;
}

const servers = ["dev.artux.net", "app.artux.net"];
const types = ["PUBLIC", "PRIVATE", "COMMUNITY"];

const ImportFromServerButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [serverStories, setServerStories] = useState([]);

  const [config, setConfig] = useState<IConfig>({
    server: "dev.artux.net",
    type: "PRIVATE",
    archive: false,
  });

  useEffect(() => {
    const getServerStories = async () => {
      const url = `https://${config.server}/pdanetwork/api/v1/admin/quest/storage/all?size=100&type=${config.type}&archive=${config.archive}`;
      const res = await fetch(url, {
        headers: {
          Authorization: "Basic " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setServerStories(data.content);
    };

    getServerStories();
    return () => setServerStories([]);
  }, [config]);

  return (
    <>
      <Button
        fontWeight="normal"
        onClick={() => {
          onOpen();
        }}
      >
        Импорт историй с сервера
      </Button>

      <Drawer onClose={onClose} isOpen={isOpen} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            Импорт историй с сервера
          </DrawerHeader>
          <DrawerBody>
            <Box display="grid" gap={2}>
              <FormControl>
                <FormLabel>Сервер:</FormLabel>
                <Select
                  value={config.server}
                  onChange={(e) => {
                    setConfig({ ...config, server: e.target.value });
                  }}
                >
                  {servers.map((server) => (
                    <option value={server} key={server}>
                      {server}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Тип истории:</FormLabel>
                <Select
                  value={config.type}
                  onChange={(e) => {
                    setConfig({ ...config, type: e.target.value });
                  }}
                >
                  {types.map((type) => (
                    <option value={type} key={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel>В архиве:</FormLabel>
                <Checkbox
                  checked={config.archive}
                  onChange={(e) =>
                    setConfig({ ...config, archive: e.target.checked })
                  }
                ></Checkbox>
              </FormControl>
              <Box display="grid" gap={2} alignItems="center">
                {!serverStories.length && "Загрузка..."}
                {serverStories.map((story: any) => (
                  <Card variant="outline" p={2} key={story.storageId}>
                    <Text>{story.title}</Text>
                    <Text fontSize="small" color="gray">
                      Загрузил: {story.author.login},{" "}
                      {new Date(story.timestamp).toLocaleString()}
                    </Text>
                  </Card>
                ))}
              </Box>
            </Box>
          </DrawerBody>
          <DrawerFooter display="flex" gap={2}>
            <Button onClick={onClose}>Закрыть</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { ImportFromServerButton };
