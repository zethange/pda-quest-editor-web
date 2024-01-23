import React, { useEffect, useState } from "react";
import CustomHead from "@/components/Global/CustomHead";
import Link from "next/link";
import Image from "next/image";

const Page404 = () => {
  const [date, setDate] = useState("blue");
  useEffect(() => setDate(new Date().toISOString()), []);

  return (
    <React.Fragment>
      <CustomHead title={"404"} />
      <main
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "var(--white)",
          color: "var(--black)",
        }}
      >
        <div>
          <Image
            src={API_URL + "/images/poster.png"}
            width={300}
            height={300}
            alt="PDA LOGO"
          />
          <h2>404 - страница не найдена.</h2>
          <p>Иди своей дорогой, сталкер.</p>
          <p>{date}</p>
          <Link href={"/"}>Вернуться на главную</Link>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Page404;
