import React from "react";
import Link from "next/link";

import NavBar from "@/components/UI/NavBar";
import ChangeThemeButton from "@/components/UI/ChangeThemeButton";
import { GrChapterAdd, GrMapLocation } from "react-icons/gr";

export default function UpNavBar({ children }: { children?: React.ReactNode }) {
  return (
    <NavBar>
      <button className="navbar__header" onClick={() => window.history.go(-1)}>
        Назад
      </button>
      <button className="navbar__header navbar__header--active">
        <GrChapterAdd style={{ paddingTop: "5px" }} />
        Глава
      </button>
      <Link href="/edit/map" className="navbar__header">
        <GrMapLocation style={{ paddingTop: "5px" }} />
        Карта
      </Link>
      <button className="mx-auto"></button>
      <ChangeThemeButton />
      <Link className="navbar__header" href="/edit/chapter/help">
        Помощь
      </Link>
      {children}
    </NavBar>
  );
}
