import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

import NavBar from "@/components/UI/NavBar";
import UpNavBar from "@/components/Global/UpNavBar";
import CustomHead from "@/components/Global/CustomHead";

export default function mapEditor() {
  const { data: session } = useSession() as any;

  useEffect(() => {
    fetch("https://api.github.com/repos/artux-net/files", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
  }, [session]);

  return (
    <>
      <CustomHead title="Редактирование карт" />
      <main className="main">
        <UpNavBar />
        <NavBar>
          <div className="navbar__header no-select">Добавить метку</div>
        </NavBar>
        <div>
          {!session ? (
            <a
              href={`/api/auth/signin`}
              onClick={(e) => {
                e.preventDefault();
                signIn();
              }}
            >
              Войти
            </a>
          ) : (
            <>
              <div>{JSON.stringify(session)}</div>
              <a
                href={`/api/auth/signout`}
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Выйти
              </a>
            </>
          )}
        </div>
      </main>
    </>
  );
}
