import AuthModal from "@/components/Global/AuthModal";
import { $isAuthModalOpen, authRequested } from "@/features/auth";
import React, { memo, useEffect, useState } from "react";
import { useUnit } from "effector-react";

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [isAuthModalOpen, requestAuth] = useUnit([$isAuthModalOpen, authRequested]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    requestAuth();
  }, [requestAuth]);

  useEffect(() => {
    setShowAuthModal(isAuthModalOpen);
  }, [isAuthModalOpen]);

  return (
    <>
      {children}
      <AuthModal isOpen={showAuthModal} onClose={(nextState) => setShowAuthModal(nextState)} />
    </>
  );
};

export default memo(AuthProvider);
