import { useEffect, useState } from "react";
import { newChapter } from "@/store/types";
import Link from "next/link";

import Head from "next/head";
import Card from "@/components/UI/Card";
import NavBar from "@/components/UI/NavBar";
import ChangeThemeButton from "@/components/UI/ChangeThemeButton";

export default function Home() {
  const [listChapters, setListChapters] = useState<any>([]); // это полностью все главы в массиве
  const [keyChapters, setKeyChapters] = useState<any>([]); // это key для localstorage для кажой главы
  const [loaded, setLoaded] = useState<boolean>(false);

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
        setLoaded(false);
      }
    };

    reader.onerror = await function () {
      console.log(reader.error);
      setLoaded(false);
    };
  };

  const createChapter = async () => {
    await localStorage.setItem(
      `chapter_${keyChapters.length}`,
      JSON.stringify(newChapter(keyChapters.length))
    );
    await setLoaded(false);
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
      stages.push(JSON.parse(localStorage.getItem(stage) as any));
    });

    setKeyChapters(keyStages);
    setListChapters(stages);
    setLoaded(true);
  }, [loaded]);

  return (
    <>
      <Head>
        <title>PDA Quest Editor</title>
        <meta name="description" content="Редактор квестов для PDA" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://artux.net/favicon-32x32.png" />
      </Head>
      <main className="main">
        <NavBar>
          <button className="navbar__header navbar__header--active">
            История
          </button>
          <button className="navbar__header">Карта</button>
          <div className="mx-auto"></div>
          <ChangeThemeButton />
          <Link className="navbar__header" href="/edit/chapter/help">
            Помощь
          </Link>
        </NavBar>
        <hr />
        <NavBar>
          <input
            type="file"
            className="navbar__header"
            onChange={onChangeChapter}
            accept="application/json"
          />
          <button className="navbar__header" onClick={() => createChapter()}>
            Создать главу
          </button>
          <button className="navbar__header">Редактирование</button>
        </NavBar>
        <div className="work-space">
          <div className="card-parent">
            {listChapters.map((chapter: any, index: number) => (
              <Card
                title={"Глава " + chapter?.id}
                link={"/edit/chapter/" + chapter?.id}
                key={chapter?.id}
                id={index}
              >
                <div>Количество стадий: {chapter?.stages?.length}</div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
