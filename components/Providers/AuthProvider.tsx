import AuthModal from "@/components/Global/AuthModal";
import useFetching from "@/hooks/useFetching";
import { useAppDispatch } from "@/store/reduxHooks";
import { setUser } from "@/store/reduxStore/userSlice";
import { IUser } from "@/store/types/userType";
import React, { memo, useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data, response, isLoading } = useFetching<IUser>(
    "/pdanetwork/api/v1/user/info"
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    // if (data?.login === "Redoks") {
    //   alert("Гееерман, опять редактор ломаешь???");
    // }
    if (response?.status === 401) {
      setShowAuthModal(true);
    } else {
      fetch("/api/check/auth", {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        },
      }).then((res) => res.text());
      dispatch(setUser(data as IUser));
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
