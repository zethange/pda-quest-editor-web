import { useRouter } from "next/router";

import CustomHead from "@/components/Global/CustomHead";
import NavBar from "@/components/UI/NavBar";
import UpNavBar from "@/components/Global/UpNavBar";

export default function MapId() {
  const { query, isReady } = useRouter();
  const mapId = query.mapId as string;

  return (
    <>
      <CustomHead title={"Редактирование карты " + mapId} />
      <main className="main">
        <UpNavBar />
        <NavBar>
          <div className="navbar__header no-select">Добавить метку</div>
        </NavBar>
      </main>
    </>
  );
}
