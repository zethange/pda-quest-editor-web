import { useEffect, useState } from "react";
import store from "store2";
import { useRouter } from "next/router";
import Link from "next/link";

import CustomHead from "@/components/Global/CustomHead";
import UpNavBar from "@/components/Global/UpNavBar";
import NavBar from "@/components/UI/NavBar";
import { newChapter } from "@/store/types";
import { MdDelete } from "react-icons/md";

export default function storyId() {
  const { query, isReady } = useRouter();
  const storyId = query.storyId as string;

  const [chapters, setChapters] = useState<any>([]);

  useEffect(() => {
    store.each((key, value) => {
      key.includes(`story_${storyId}_chapter`) &&
        setChapters((chapters: any) => [...chapters, value]);
      if (key === "stopLoop") return false;
    });
  }, [isReady]);

  const createChapter = () => {
    store.set(
      `story_${storyId}_chapter_${chapters.length}`,
      newChapter(chapters.length)
    );
    setChapters((chapters: any) => [...chapters, newChapter(chapters.length)]);

    console.log(`Создание главы в истории ${storyId}`, [
      ...chapters,
      newChapter(chapters.length),
    ]);
  };

  const deleteChapter = (id: number) => {
    store.remove(`story_${storyId}_chapter_${id}`);
    setChapters(chapters.filter((chapter: any) => id !== chapter.id));
    console.log("Удаление главы", `story_${storyId}_chapter_${id}`);
  };

  return (
    <>
      <CustomHead title="Редактирование карт" />
      <main className="main">
        <UpNavBar />
        <hr />
        <NavBar>
          <div
            className="navbar__header no-select"
            onClick={() => createChapter()}
          >
            Создать главу
          </div>
        </NavBar>
        <div className="work-space">
          <div className="card-parent">
            {chapters.map((chapter: any) => (
              <div className="card" key={chapter?.id}>
                <Link href={"/edit/chapter/" + storyId + "/" + chapter?.id}>
                  <div className="card__header">{`Глава ${chapter?.id}`}</div>
                  <div className="card__body">
                    Количество стадий: {chapter?.stages?.length}
                  </div>
                </Link>
                <div
                  style={{
                    padding: "10px",
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                  }}
                >
                  <button
                    style={{ fontSize: "15px" }}
                    onClick={() => deleteChapter(chapter?.id)}
                  >
                    <MdDelete style={{ paddingTop: "4px" }} />
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
