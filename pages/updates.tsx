import Head from "next/head";
import UpNavBar from "@/components/Global/UpNavBar";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/store/tools";

export default function Updates() {
  const { data, isLoading } = useSWR(
    "https://api.github.com/repos/ZetHange/pda-quest-editor-web/commits",
    fetcher
  );
  return (
    <>
      <Head>
        <title>Помощь :: PDA Quest Editor</title>
        <meta name="description" content="Редактор главы" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://artux.net/favicon-32x32.png" />
      </Head>
      <main className="main">
        <UpNavBar />
        <div
          style={{
            padding: "10px",
            height: "calc(100vh - 39px)",
            overflow: "auto",
          }}
        >
          {!isLoading &&
            data.map((commit: any, indexCommit: number) => (
              <div key={commit.node_id} style={{ display: "flex" }}>
                <a href={commit.author.html_url}>
                  <img
                    src={commit.author.avatar_url}
                    style={{ width: "32px", borderRadius: "25%" }}
                    alt={commit.author.login}
                  />
                </a>
                <a style={{ margin: "5px" }} href={commit.html_url}>
                  <span
                    style={{
                      background: "var(--light-gray)",
                      padding: "4px",
                      borderRadius: "4px",
                    }}
                  >
                    {new Date(commit.commit.committer.date).toLocaleString()}
                  </span>
                  <small> {commit.commit.message}</small>
                </a>
              </div>
            ))}
        </div>
      </main>
    </>
  );
}
