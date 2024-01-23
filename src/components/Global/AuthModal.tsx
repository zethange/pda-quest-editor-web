import { API_URL } from "@/shared/config";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { FormEvent, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: (type: boolean) => void;
}

const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = btoa(login + ":" + password);

    const response = await fetch(API_URL + "/api/v1/user/info", {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    if (response.status === 401) {
      toast({
        title: `Логин или пароль неправильный`,
        status: "error",
        isClosable: true,
      });
    } else if (response.status === 200) {
      toast({
        title: `Вы успешно вошли`,
        status: "success",
        isClosable: true,
      });
      localStorage.setItem("token", token);
      onClose(false);
    }

    setLogin("");
    setPassword("");
  };

  return (
    <Modal onClose={() => {}} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Авторизация</ModalHeader>
        <form onSubmit={handleLogin}>
          <ModalBody>
            <FormControl>
              <FormLabel>Логин:</FormLabel>
              <Input
                placeholder="Логин..."
                required
                onChange={(e) => setLogin(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Пароль:</FormLabel>
              <Input
                placeholder="Пароль..."
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="teal">
              Войти
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
