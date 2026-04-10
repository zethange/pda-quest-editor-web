import { Link } from "react-router-dom";
import CustomHead from "@/components/Global/CustomHead";
import { Button } from "@/shared/ui";

export function NotFoundPage() {
  const date = new Date().toISOString();

  return (
    <>
      <CustomHead title="404" />
      <main className="flex min-h-screen w-full items-center justify-center bg-white text-black">
        <div className="space-y-3 text-center">
          <img
            src="https://dev.artux.net/pdanetwork/images/poster.png"
            width={300}
            height={300}
            alt="PDA LOGO"
            className="mx-auto"
          />
          <h2 className="text-xl font-semibold">404 - страница не найдена.</h2>
          <p>Иди своей дорогой, сталкер.</p>
          <p className="text-xs text-zinc-500">{date}</p>
          <Link to="/">
            <Button variant="outline">Вернуться на главную</Button>
          </Link>
        </div>
      </main>
    </>
  );
}
