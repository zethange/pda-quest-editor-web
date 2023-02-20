import React, { useEffect } from "react";
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

  return (
    <div className="card">
      <Link href={link}>
        <div className="card__header">{title}</div>
        <div className="card__body">{children}</div>
      </Link>
      <button
        style={{
          fontSize: "15px",
          padding: "10px",
          position: "absolute",
          top: "0px",
          right: "0px",
        }}
        onClick={() => deleteChapter()}
      >
        Удалить
      </button>
    </div>
  );
}
