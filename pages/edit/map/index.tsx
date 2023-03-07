import NavBar from "@/components/UI/NavBar";
import UpNavBar from "@/components/UpNavBar";
import CustomHead from "@/components/Global/CustomHead";

export default function mapEditor() {
  return (
    <>
      <CustomHead title="Редактирование карт" />
      <main className="main">
        <UpNavBar />
        <NavBar>
          <div className="navbar__header no-select">Добавить метку</div>
        </NavBar>
      </main>
    </>
  );
}
