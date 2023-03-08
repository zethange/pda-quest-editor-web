import NavBar from "./NavBar";

export default function NavBars() {
  return (
    <>
      <NavBar>
        <p className="navbar__header navbar__header--active">История</p>
        <p className="navbar__header">Карта</p>
        <p className="mx-auto"></p>
        <p className="navbar__header">Помощь</p>
      </NavBar>
      <hr />
      <NavBar>
        <p className="navbar__header">
          <i className="fa-solid fa-file-import"></i> Импорт главы
        </p>
        <p className="navbar__header">
          <i className="fa-solid fa-pen-to-square"></i> Редактирование
        </p>
      </NavBar>
    </>
  );
}
