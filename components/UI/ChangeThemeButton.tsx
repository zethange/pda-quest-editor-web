import { useEffect, useState } from "react";

export default function ChangeThemeButton() {
  const [theme, setTheme] = useState("light");

  const changeTheme = () => {
    const att = document.createAttribute("data-app-theme");
    if (theme === "light") {
      att.value = "dark";
      setTheme("dark");
    } else {
      att.value = "light";
      setTheme("light");
    }

    // @ts-ignore
    document.querySelector("main").setAttributeNode(att);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches)
      setTheme("dark");
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches)
      changeTheme();
    if (
      window.matchMedia("(prefers-color-scheme: light)").matches &&
      theme === "dark"
    )
      changeTheme();
  }, []);

  return (
    <button className="navbar__header" onClick={changeTheme}>
      Сменить тему
    </button>
  );
}
