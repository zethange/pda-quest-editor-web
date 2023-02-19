import Head from 'next/head'
import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>PDA Quest Editor</title>
        <meta name="description" content="Редактор квестов для PDA" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='main'>
        <nav className="navbar">
          <p className="navbar__header navbar__header--active">История</p>
          <p className="navbar__header">Карта</p>
          <p className="mx-auto"></p>
          <p className="navbar__header">Помощь</p>
        </nav>
      </main>
    </>
  )
}
