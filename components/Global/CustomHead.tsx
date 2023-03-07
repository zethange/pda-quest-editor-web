import Head from "next/head";

export default function CustomHead({ title }: { title: string }) {
  return (
    <Head>
      <title>{title} :: PDA Quest Editor</title>
      <meta name="description" content="Редактор главы" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="https://artux.net/favicon-32x32.png" />
    </Head>
  );
}
