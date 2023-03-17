import React from "react";
import Link from "next/link";

import NavBar from "@/components/UI/NavBar";
import ChangeThemeButton from "@/components/UI/ChangeThemeButton";
import { GrChapterAdd, GrMapLocation } from "react-icons/gr";
import { signIn, signOut, useSession } from "next-auth/react";

export default function UpNavBar({ children }: { children?: React.ReactNode }) {
  const { data: session } = useSession();

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
      <Link className="navbar__header" href="/help">
        Помощь
      </Link>
      <div style={{ borderLeft: "1px solid #ccc" }} />
      {!session ? (
        <a
          href={`/api/auth/signin`}
          className="navbar__header"
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          Войти
        </a>
      ) : (
        <a
          href={`/api/auth/signout`}
          className="navbar__header"
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          {session?.user?.name} | Выйти
        </a>
      )}
      {children}
    </NavBar>
  );
}
