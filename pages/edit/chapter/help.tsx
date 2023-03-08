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
import UpNavBar from "@/components/Global/UpNavBar";
import Link from "next/link";

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
          <UpNavBar>
            <Link className="navbar__header" href="/updates">
              Обновления
            </Link>
          </UpNavBar>
          <div
            style={{
              height: "calc(100vh - 39px)",
              overflow: "auto",
              padding: "25px",
            }}
          >
            <h1>Редактор квестов ПДА</h1>
            <DiscordMessages lightTheme>
              <DiscordMessage author="Писяпопа">
                Ну вот, держи редактор квестов, тут всё интуитивно понятно
              </DiscordMessage>
              <DiscordMessage
                author="Конечный пользователь"
                avatar="https://hstock.s3.eu-central-1.amazonaws.com/images/products/9628/a534f6a6-d312-413e-b530-756cc055ad1c-800.png"
                highlight
              >
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
