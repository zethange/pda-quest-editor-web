import React, { memo } from "react";
import Link from "next/link";

import NavBar from "@/components/UI/NavBar/NavBar";
import ChangeThemeButton from "@/components/UI/ChangeThemeButton";
import { MdCreate, MdTextSnippet } from "react-icons/md";

import { signIn, signOut, useSession } from "next-auth/react";

const UpNavBar = ({ children }: { children?: React.ReactNode }) => {
  const { data: session } = useSession();

  return (
    <NavBar>
      <button className="navbar__header" onClick={() => window.history.go(-1)}>
        Назад
      </button>
      <button className="navbar__header navbar__header--active">
        <MdCreate style={{ paddingTop: "5px" }} />
        Глава
      </button>
      <button className="mx-auto"></button>
      <ChangeThemeButton />
      <Link className="navbar__header" href="/pages/help">
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
};

export default memo(UpNavBar);
