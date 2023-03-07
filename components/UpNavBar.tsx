import NavBar from "@/components/UI/NavBar";
import Link from "next/link";
import ChangeThemeButton from "@/components/UI/ChangeThemeButton";
import React from "react";

export default function UpNavBar() {
  return (
    <NavBar>
      <button className="navbar__header" onClick={() => window.history.go(-1)}>
        Назад
      </button>
      <button className="navbar__header navbar__header--active">Глава</button>
      <Link href="/edit/map" className="navbar__header">
        Карта
      </Link>
      <button className="mx-auto"></button>
      <ChangeThemeButton />
      <Link className="navbar__header" href="/edit/chapter/help">
        Помощь
      </Link>
    </NavBar>
  );
}
