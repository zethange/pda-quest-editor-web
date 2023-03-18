import CustomHead from "@/components/Global/CustomHead";
import ChangeThemeButton from "@/components/UI/ChangeThemeButton";
import NavBar from "@/components/UI/NavBar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { MdImportExport } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import store from "store2";
import { downloadZip } from "client-zip";
import { Last } from "react-bootstrap/esm/PageItem";

export default function Home() {
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

  async function downloadStory(story_id: number) {
    const info = {
      name: "info.json",
      lastModified: new Date(),
      input: JSON.stringify(store.get(`story_${story_id}_info.json`)),
    };

    const arrChapters: any[] = [];

    store.each((key: string, value: string) => {
      if (key.includes(`story_${story_id}_chapter`)) {
        arrChapters.push({
          name: `chapter_${key.split("_")[3]}.json`,
          lastModified: new Date(),
          input: JSON.stringify(value),
        });
      }
      if (key === "stopLoop") return false;
    });

    const blob = await downloadZip([info, ...arrChapters]).blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `story_${story_id}.zip`;
    link.click();
    link.remove();
  }

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
              <div className="card" key={index}>
                <Link href={"/edit/story/" + story?.id}>
                  <div className="card__header">{story?.title}</div>
                  <div className="card__body">
                    <div>{story?.desc}</div>
                    <div>Уровень доступа: {story?.access}</div>
                  </div>
                </Link>
                <button
                  className="card__popover"
                  onClick={() => downloadStory(story?.id)}
                >
                  Скачать
                </button>
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
function saveAs(content: any, arg1: string) {
  throw new Error("Function not implemented.");
}
