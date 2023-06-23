import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { setMissionInStore } from "@/store/reduxStore/stageSlice";
import { generateSlug } from "@/store/tools/slugGenerator";
import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";

const EditMission = () => {
  const mission = useAppSelector((state) => state.stage.mission);
  const dispatch = useDispatch();

  return (
    <Box
      p={2}
      my={2}
      backgroundColor="gray.100"
      _dark={{
        backgroundColor: "gray.700",
      }}
      borderRadius="10px"
    >
      <b>Редактор миссий</b>
      <FormControl
        backgroundColor="white"
        p={2}
        _dark={{
          backgroundColor: "gray.600",
        }}
        borderRadius="10px"
      >
        <FormLabel>Название миссии:</FormLabel>
        <Input
          backgroundColor="white"
          defaultValue={mission.title}
          _dark={{
            backgroundColor: "gray.900",
          }}
          placeholder="Название миссии..."
          onChange={(event) => {
            console.log(generateSlug(event.target.value));
            dispatch(
              setMissionInStore({
                title: event.target.value,
                name: generateSlug(event.target.value),
              })
            );
          }}
        />
      </FormControl>
    </Box>
  );
};

export default EditMission;
