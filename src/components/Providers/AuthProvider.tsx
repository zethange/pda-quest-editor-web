import AuthModal from "@/components/Global/AuthModal";
import useFetching from "@/hooks/useFetching";
import { API_URL } from "@/shared/config";
import { useAppDispatch } from "@/store/reduxStore/reduxHooks";
import { setUser } from "@/store/reduxStore/slices/userSlice";
import { IUser } from "@/store/types/userType";
import { FC, ReactNode, memo, useEffect, useState } from "react";

export interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data, response, isLoading } = useFetching<IUser>(
    API_URL + "/api/v1/user/info"
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
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
