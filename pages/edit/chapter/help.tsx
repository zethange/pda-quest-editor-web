import ReactMarkdown from "react-markdown";
import React, { useState } from "react";
import Head from "next/head";
// @ts-ignore
import remarkGfm from "remark-gfm";

import NavBar from "@/components/UI/NavBar";
import ChangeThemeButton from "@/components/UI/ChangeThemeButton";
import FormFeedBack from "@/components/FormFeedBack";
import {
  DiscordMention,
  DiscordMessage,
  DiscordMessages,
  DiscordReply,
} from "@skyra/discord-components-react";

export default function Help() {
  const [markdown, setMarkdown] = useState<any>();
  fetch("/docs/stage-help.md")
    .then((response) => response.text())
    .then((result) => setMarkdown(result));

  if (markdown)
    return (
      <>
        <Head>
          <title>Помощь :: PDA Quest Editor</title>
          <meta name="description" content="Редактор главы" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="https://artux.net/favicon-32x32.png" />
        </Head>
        <main className="main">
          <NavBar>
            <button
              className="navbar__header"
              onClick={() => window.history.go(-1)}
            >
              Назад
            </button>
            <button className="navbar__header navbar__header--active">
              Глава
            </button>
            <button className="navbar__header">Карта</button>
            <button className="mx-auto"></button>
            <ChangeThemeButton />
            <button className="navbar__header">Помощь</button>
          </NavBar>
          <div
            style={{
              height: "calc(100vh - 39px)",
              overflow: "auto",
              padding: "25px",
            }}
          >
            <h1>Редактор квестов ПДА</h1>
            <DiscordMessages lightTheme>
              <DiscordMessage author="Писяпопа" profile="pisya">
                Ну вот, держи редактор квестов, тут всё интуитивно понятно
              </DiscordMessage>
              <DiscordMessage
                author="Тот самый конечный пользователь"
                profile="user"
                highlight
              >
                <DiscordReply slot="reply" profile="pisya">
                  Ну вот, держи редактор квестов, тут всё интуитивно понятно
                </DiscordReply>
                <DiscordMention>Писяпопа</DiscordMention>, а как переход
                создавать? аАаАа, так эти штуки соединять можна!
              </DiscordMessage>
            </DiscordMessages>
            <ReactMarkdown remarkPlugins={[remarkGfm]} children={markdown} />
          </div>
        </main>
      </>
    );
}
