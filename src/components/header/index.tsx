"use client";

import HeaderLink from "./headerLink";
import ThemeSwitcher from "../ThemeSwitcher";
import Modal, { useModalState } from "../ui/modal";

const Header = () => {
  const { isOpen, open, close } = useModalState();

  return (
    <header
      className="w-full flex z-10 items-center justify-between mb-8 py-8 px-4 md:px-2
  md:p-4"
    >
      <HeaderLink to="/">kkrll</HeaderLink>
      <nav className="flex gap-0 md:gap-2">
        <ThemeSwitcher />
        <HeaderLink to="/resume">resume</HeaderLink>
        <HeaderLink onClick={open}>contact</HeaderLink>
      </nav>
      {isOpen && <Modal onClose={close}> contact popup </Modal>}
    </header>
  );
};

export default Header;
