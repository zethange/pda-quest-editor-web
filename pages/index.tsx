import { useState, useEffect, useCallback } from "react";

import Card from "@/components/UI/Card";
import NavBar from "@/components/UI/NavBar";
import CustomHead from "@/components/Global/CustomHead";
import { MdImportExport } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import Link from "next/link";
import ChangeThemeButton from "@/components/UI/ChangeThemeButton";
import { Modal } from "react-bootstrap";
import store from "store2";

export default function Home() {
  // const [listChapters, setListChapters] = useState<any>([]); // это полностью все главы в массиве
  // const [keyChapters, setKeyChapters] = useState<any>([]); // это key для localstorage для кажой главы
  // const [loaded, setLoaded] = useState<boolean>(false);

  // useEffect(() => {
  //   const keyStages = [];
  //   const stages: any[] = [];

  //   for (let item in localStorage) {
  //     if (item.split("_")[1] !== undefined) {
  //       keyStages.push(item);
  //     }
  //   }

  //   keyStages.map((stage) => {
  //     stages.push(JSON.parse(localStorage.getItem(stage) as any));
  //   });

  //   setKeyChapters(keyStages);
  //   setListChapters(stages);
  //   setLoaded(true);
  // }, [loaded]);

  // const onChangeChapter = async (e: any) => {
  //   const file = await e.target.files[0];
  //   let reader = await new FileReader();
  //   await reader.readAsText(file);

  //   reader.onload = await function () {
  //     if (typeof reader.result === "string") {
  //       localStorage.setItem(
  //         String("chapter_" + JSON.parse(reader.result).id),
  //         reader.result
  //       );
  //       setLoaded(false);
  //     }
  //   };
  // };

  // const createChapter = async () => {
  //   await localStorage.setItem(
  //     `chapter_${keyChapters.length}`,
  //     JSON.stringify(newChapter(listChapters.length))
  //   );
  //   await setLoaded(false);
  // };

  const [stories, setStories] = useState<any>([]);

  function createStory(): void {
    const infoJSON = {
      id: stories.length,
      title: `Новая история ${stories.length}`,
      desc: "Новая история, новая... Да кароче...",
      icon: `story/freeplay/screen/${Math.round(Math.random() * 40)}.jpg`,
      access: "USER",
    };

    setStories((stories: any) => [...stories, infoJSON]);
    store.set(`story_${stories.length}_info.json`, infoJSON);
  }

  useEffect(() => {
    store.each((key, value) => {
      key.includes("info.json") &&
        setStories((stories: any) => [...stories, value]);
      if (key === "stopLoop") return false;
    });
  }, []);

  return (
    <>
      <CustomHead title="Редактор историй" />
      <main className="main">
        <NavBar>
          <MdImportExport
            style={{ marginTop: "10px", width: "24px", height: "24px" }}
          />
          <button className="navbar__header" onClick={() => createStory()}>
            <IoMdCreate style={{ paddingTop: "3px" }} />
            Создать историю
          </button>
          <div className="mx-auto"></div>
          <ChangeThemeButton />
          <Link href="/edit/map" className="navbar__header">
            <p style={{ paddingTop: "3px" }}>Карты</p>
          </Link>
          <button
            className="navbar__header"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Удалить всё
          </button>
        </NavBar>
        <div className="work-space">
          <div className="card-parent">
            {stories.map((story: any, index: number) => (
              <div className="card">
                <Link href={"/edit/story/" + story?.id}>
                  <div className="card__header">{story?.title}</div>
                  <div className="card__body">
                    <div>{story?.desc}</div>
                    <div>Уровень доступа: {story?.access}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <Modal>
          <Modal.Title>Але</Modal.Title>
        </Modal>
      </main>
    </>
  );
}
