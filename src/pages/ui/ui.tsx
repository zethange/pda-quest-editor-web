import { AutocompleteInput } from "@/shared/ui";
import { Box, Heading } from "@chakra-ui/react";
import { useState } from "react";

const UI = () => {
  const [value, setValue] = useState("");
  return (
    <Box p={10}>
      <Heading>UIKit</Heading>
      <Box>
        <Box>Autocomplete</Box>
        <AutocompleteInput
          value={value}
          onChange={(value) => setValue(value)}
          parameters={["pomidor", "stalker", "герман иди чекай свободку"]}
        />
      </Box>
    </Box>
  );
};

export default UI;
