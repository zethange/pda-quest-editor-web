import Head from "next/head";
import NavBar from "@/components/UI/NavBar";
import Link from "next/link";
import ChangeThemeButton from "@/components/UI/ChangeThemeButton";
import { useRouter } from "next/router";
import UpNavBar from "@/components/UpNavBar";
import CustomHead from "@/components/Global/CustomHead";

export default function MapId() {
  const { query, isReady } = useRouter();
  const mapId = query.mapId as string;

  return (
    <>
      <CustomHead title={"Редактирование карты" + mapId} />
      <main className="main">
        <UpNavBar />
        <NavBar>
          <div className="navbar__header no-select">Добавить метку</div>
        </NavBar>
      </main>
    </>
  );
}
