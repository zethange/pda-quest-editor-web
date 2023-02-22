import Head from "next/head";
import NavBar from "@/components/UI/NavBar";
import { useEffect, useState } from "react";

export default function () {
  const [theme, setTheme] = useState<any>();
  useEffect(() => {
    const ball: any = document.getElementById("stage");
    const stageMain: any = document.getElementById("stage-main");

    ball.onmousedown = function (e: any) {
      ball.style.position = "absolute";
      moveAt(e);
      stageMain.appendChild(ball);

      ball.style.zIndex = 1000;

      function moveAt(e: any) {
        ball.style.left = e.pageX - ball.offsetWidth / 2 + "px";
        ball.style.top = e.pageY - ball.offsetHeight / 2 + "px";
      }

      // 3, перемещать по экрану
      document.onmousemove = function (e) {
        moveAt(e);
      };

      // 4. отследить окончание переноса
      ball.onmouseup = function () {
        document.onmousemove = null;
        ball.onmouseup = null;
      };

      ball.ondragstart = function () {
        return false;
      };
    };
  });

  const changeTheme = () => {
    const att = document.createAttribute("data-app-theme");
    if (theme === "light") {
      att.value = "dark";
      setTheme("dark");
    } else {
      att.value = "light";
      setTheme("light");
    }

    // @ts-ignore
    document.querySelector("main").setAttributeNode(att);
  };

  return (
    <>
      <Head>
        <title>Редактирование главы да</title>
        <meta name="description" content="Редактор главы" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <NavBar>
          <button className="navbar__header navbar__header--active">
            Глава
          </button>
          <button className="navbar__header">Карта</button>
          <button className="mx-auto"></button>
          <button className="navbar__header" onClick={changeTheme}>
            Сменить тему :)
          </button>
          <button className="navbar__header">Помощь</button>
        </NavBar>
        <hr />
        <NavBar>
          <button className="navbar__header">Создать стадию</button>
        </NavBar>
        <div className="stage-body">
          <div className="stage-parent" id="stage-main">
            <div className="stage-card" id="stage">
              <h2>Стадия 1</h2>
              Переход на стадию: 2 <b>или</b> 3
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
