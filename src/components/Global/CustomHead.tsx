import { useEffect } from "react";

export default function CustomHead({ title }: { title: string }) {
  useEffect(() => {
    document.title = `${title} :: PDA Quest Editor`;

    const description =
      document.querySelector<HTMLMetaElement>('meta[name="description"]') ??
      document.createElement("meta");
    description.name = "description";
    description.content = "Редактор главы";
    if (!description.parentNode) {
      document.head.appendChild(description);
    }

    const favicon =
      document.querySelector<HTMLLinkElement>('link[rel="icon"]') ??
      document.createElement("link");
    favicon.rel = "icon";
    favicon.href = "https://artux.net/favicon-32x32.png";
    if (!favicon.parentNode) {
      document.head.appendChild(favicon);
    }
  }, [title]);

  return null;
}
