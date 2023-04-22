import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button, Text } from "@chakra-ui/react";

const UserButton = () => {
  const { data: session } = useSession();

  return (
    <>
      {!session ? (
        <a
          href={`/api/auth/signin`}
          className="navbar__header"
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          <Button fontWeight="normal">Войти</Button>
        </a>
      ) : (
        <a
          href={`/api/auth/signout`}
          className="navbar__header"
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          <Button fontWeight="normal">
            <Text>{session?.user?.name} | Выйти</Text>
          </Button>
        </a>
      )}
    </>
  );
};

export default UserButton;