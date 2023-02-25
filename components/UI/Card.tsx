import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Card({
  title,
  children,
  link,
  id,
}: {
  title: string;
  children: React.ReactNode;
  link: any;
  id: any;
}) {
  const deleteChapter = () => {
    console.log(`Удаляем стадию с ID: ${id}`);
    localStorage.removeItem("chapter_" + id);
  };

  const [chapter, setChapter] = useState<any>();

  useEffect(() => {
    const chapterFromLocaleStorage = JSON.parse(
      localStorage.getItem(`chapter_${id}`) as any
    );
    setChapter(chapterFromLocaleStorage);
  }, []);

  function downloadAsFile(data: any) {
    let a = document.createElement("a");
    let file = new Blob([JSON.stringify(data)], { type: "application/json" });
    a.href = URL.createObjectURL(file);
    a.download = `chapter_${id}.json`;
    a.click();
  }

  return (
    <div className="card">
      <Link href={link}>
        <div className="card__header">{title}</div>
        <div className="card__body">{children}</div>
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
          style={{ fontSize: "15px", paddingRight: "5px" }}
          onClick={() => downloadAsFile(chapter)}
        >
          Скачать
        </button>
        <button style={{ fontSize: "15px" }} onClick={() => deleteChapter()}>
          Удалить
        </button>
      </div>
    </div>
  );
}
