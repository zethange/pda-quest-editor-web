import React, { FC, useEffect, useState } from "react";
import { Log } from "@/store/validator";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Box, Flex, Input } from "@chakra-ui/react";
import { Logs } from "@/components/Chapter/UtilitiesDrawer";
import { chapterType } from "@/store/types/story/chapterType";
import { FindStageByText } from "@/store/utils/chapterUtils/FindStageByText";

interface Props {
  chapter: chapterType;
  openStage: (stageId: string) => void;
  onClose: () => void;
}

const SearchText: FC<Props> = ({ openStage, chapter, onClose }) => {
  const [logsFindText, setLogsFindText] = useState<Log[]>([]);
  const [text, setText] = useState("");
  const search = new FindStageByText(setLogsFindText);

  useEffect(() => {
    setLogsFindText([]);
    search.run(text, chapter);
  }, [text, chapter, search]);

  return (
    <AccordionItem>
      <AccordionButton>
        <Box as="span" flex="1" textAlign="left">
          Поиск стадии по тексту
        </Box>
        <AccordionIcon />
      </AccordionButton>

      <AccordionPanel>
        <Flex gap={2}>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="А как играть?"
          />
        </Flex>
        <Logs
          openStage={openStage}
          onClose={onClose}
          logs={logsFindText}
          nonInfo={false}
        />
      </AccordionPanel>
    </AccordionItem>
  );
};

export default SearchText;
