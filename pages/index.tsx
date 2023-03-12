import { useEffect, useState } from "react";
import { newChapter } from "@/store/types";

import Card from "@/components/UI/Card";
import NavBar from "@/components/UI/NavBar";
import CustomHead from "@/components/Global/CustomHead";
import { MdImportExport } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";

function UpNavBar() {
  return null;
}

export default function Home() {
  const [listChapters, setListChapters] = useState<any>([]); // это полностью все главы в массиве
  const [keyChapters, setKeyChapters] = useState<any>([]); // это key для localstorage для кажой главы
  const [loaded, setLoaded] = useState<boolean>(false);

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
  };

  const createChapter = async () => {
    await localStorage.setItem(
      `chapter_${keyChapters.length}`,
      JSON.stringify(newChapter(listChapters.length))
    );
    await setLoaded(false);
  };

  return (
    <>
      <CustomHead title="Главная" />
      <main className="main">
        <UpNavBar />
        <NavBar>
          <MdImportExport
            style={{ marginTop: "10px", width: "24px", height: "24px" }}
          />
          <input
            type="file"
            className="navbar__header"
            onChange={onChangeChapter}
            accept="application/json"
            style={{ width: "210px" }}
          />
          <button className="navbar__header" onClick={() => createChapter()}>
            <IoMdCreate style={{ paddingTop: "3px" }} />
            Создать главу
          </button>
          <div className="mx-auto"></div>
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
