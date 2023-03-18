import { useState, useEffect } from "react";
import Link from "next/link";
import store from "store2";
import { downloadZip } from "client-zip";
import { Modal } from "react-bootstrap";
import { MdImportExport } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";

import CustomHead from "@/components/Global/CustomHead";
import ChangeThemeButton from "@/components/UI/ChangeThemeButton";
import NavBar from "@/components/UI/NavBar";

export default function Home() {
  const [stories, setStories] = useState<any>([]);

  useEffect(() => {
    store.each((key: string, value: string) => {
      if (key.includes("info")) {
        setStories((stories: any) => [...stories, value]);
      }
      if (key === "stopLoop") return false;
    });
  }, []);

  function createStory(): void {
    const infoJSON = {
      id: stories.length,
      title: `Новая история ${stories.length}`,
      desc: "Новая история, новая... Да кароче...",
      icon: `story/freeplay/screen/${Math.round(Math.random() * 40)}.jpg`,
      access: "USER",
    };

    setStories((stories: any) => [...stories, infoJSON]);
    store.set(`story_${stories.length}_info`, infoJSON);
  }

  async function downloadStory(story_id: number) {
    const info = {
      name: "info.json",
      lastModified: new Date(),
      input: JSON.stringify(store.get(`story_${story_id}_info`)),
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

  const uploadStory = async (e: any) => {
    const files: any[] = [...e.target.files];

    console.log(e.target.files);
    let idStory: number

    const infoFile: any = files.filter(
      (file: any) => file.name === "info.json"
    )[0];

    const fileBase = new FileReader();
    fileBase.readAsText(infoFile);
    fileBase.onload = () => {
      idStory = Number(JSON.parse(fileBase.result as string).id);
      setStories((stories: any) => [...stories, JSON.parse(fileBase.result as string)]);
      store.set(`story_${idStory}_info`, JSON.parse(fileBase.result as string));
    };

    files.map((file: any) => {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        if (file.name.includes("chapter")) {
          store.set(
            `story_${idStory}_chapter_${
              JSON.parse(fileReader.result as string).id
            }`,
            JSON.parse(fileReader.result as string)
          );
        }
      };
    });
  };

  return (
    <>
      <CustomHead title="Редактор историй" />
      <main className="main">
        <NavBar>
          <MdImportExport
            style={{ marginTop: "10px", width: "24px", height: "24px" }}
          />
          <input
            type="file"
            {...{ directory: "", webkitdirectory: "" }}
            id="input"
            className="navbar__header"
            onChange={(e) => uploadStory(e)}
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
      </main>
    </>
  );
}
function saveAs(content: any, arg1: string) {
  throw new Error("Function not implemented.");
}
