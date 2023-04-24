import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Heading, Spacer } from "@chakra-ui/react";
import store from "store2";
import { mapType } from "@/store/types/mapType";
import CustomHead from "@/components/Global/CustomHead";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import UserButton from "@/components/UI/NavBar/UserButton";
import NavBar from "@/components/UI/NavBar/NavBar";

export default function ChapterEditById() {
  const { query, isReady } = useRouter();
  const mapRoute = (query.map as string[]) || [];
  // map/{story_id}/{map_id}

  const [map, setMap] = useState<mapType>();

  useEffect(() => {
    console.log(mapRoute, `story_${mapRoute[0]}_${mapRoute[1]}`);
    setMap(store.get(`story_${mapRoute[0]}_map_${mapRoute[1]}`));
  }, [isReady]);

  return (
    <>
      <CustomHead title={`Редактирование карты ${map?.title}`} />
      <NavBar>
        <Button fontWeight="normal" onClick={() => history.go(-1)}>
          Назад
        </Button>
        <Heading fontSize={30}>{map?.title}</Heading>
        <Spacer />
        <ChangeThemeButton rounded={true} />
        <UserButton />
      </NavBar>
    </>
  );
}
