import AuthModal from "@/components/Global/AuthModal";
import useFetching from "@/hooks/useFetching";
import React, { memo, useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { response, isLoading } = useFetching("/pdanetwork/api/v1/user/info");

  useEffect(() => {
    if (response?.status === 401) {
      setShowAuthModal(true);
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
