import HeaderLink from "./headerLink";

const Header = () => {
  return (
    <header className="w-full flex z-10 items-center justify-between mb-8 p-8 md:p-4">
      <HeaderLink to="/">kkrll</HeaderLink>
      <nav className="flex gap-4">
        <HeaderLink to="/writings">Blog</HeaderLink>
        <HeaderLink to="/resume">Projects</HeaderLink>
        <HeaderLink to="/contact">About</HeaderLink>
      </nav>
    </header>
  );
};

export default Header;
