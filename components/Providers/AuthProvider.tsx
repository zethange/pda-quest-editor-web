import AuthModal from "@/components/Global/AuthModal";
import useFetching from "@/hooks/useFetching";
import React, { memo, useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data, response, isLoading } = useFetching<{ login: string }>(
    "/pdanetwork/api/v1/user/info"
  );

  useEffect(() => {
    if (data?.login === "Redoks") {
      alert("Гееерман, опять редактор ломаешь???");
    }
    if (response?.status === 401) {
      setShowAuthModal(true);
    } else {
      fetch("/api/check/auth", {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        },
      }).then((res) => res.text());
    }
  }, [isLoading]);

  return (
    <>
      {children}
      <AuthModal isOpen={showAuthModal} onClose={setShowAuthModal} />
    </>
  );
};

export default memo(AuthProvider);
