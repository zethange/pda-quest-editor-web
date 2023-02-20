import Head from "next/head";
import Card from "@/components/UI/Card";
import NavBar from "@/components/UI/NavBar";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [listChapters, setListChapters] = useState<any>([]);

  const onChangeChapter = async (e: any) => {
    const file = await e.target.files[0];
    let reader = await new FileReader();
    await reader.readAsText(file);

    reader.onload = await function () {
      if (typeof reader.result === "string") {
        localStorage.setItem(
          String("chapter_" + JSON.parse(reader.result).id),
          reader.result
        );
      }
    };

    reader.onerror = await function () {
      console.log(reader.error);
    };
  };

  useEffect(() => {
    const keyStages = [];
    const stages: any[] = [];

    for (let item in localStorage) {
      if (item.split("_")[1] !== undefined) {
        keyStages.push(item);
      }
    }

    keyStages.map((stage) => {
      // @ts-ignore
      stages.push(JSON.parse(localStorage.getItem(stage)));
    });

    setListChapters(stages);
  });

  return (
    <>
      <Head>
        <title>PDA Quest Editor</title>
        <meta name="description" content="Редактор квестов для PDA" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <NavBar>
          <p className="navbar__header navbar__header--active">История</p>
          <p className="navbar__header">Карта</p>
          <p className="navbar__header">Всего историй: {listChapters.length}</p>
          <p className="mx-auto"></p>
          <p className="navbar__header">Помощь</p>
        </NavBar>
        <hr />
        <NavBar>
          <input
            type="file"
            className="navbar__header"
            onChange={onChangeChapter}
            accept="application/json"
          />
          <p className="navbar__header">
            <i className="fa-solid fa-pen-to-square"></i> Редактирование
          </p>
        </NavBar>
        <div className="work-space">
          <div className="card-parent">
            {listChapters.map((chapter: any) => (
              <Card
                title={"Глава " + chapter?.id}
                link={"/edit/chapter/" + chapter?.id}
                key={chapter?.id}
                id={chapter?.id}
              >
                <div>Количество стадий: {chapter?.stages.length}</div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
