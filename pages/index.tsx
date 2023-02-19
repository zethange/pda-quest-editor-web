import Head from "next/head";
import NavBars from "@/components/NavBars";
import Cards from "@/components/Cards";

export default function Home() {
  return (
    <>
      <Head>
        <title>PDA Quest Editor</title>
        <meta name="description" content="Редактор квестов для PDA" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <NavBars />
        <div className="work-space">
          <Cards />
        </div>
      </main>
    </>
  );
}
