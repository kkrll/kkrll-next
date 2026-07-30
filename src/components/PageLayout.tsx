import Footer from "./Footer";
import Header from "./header";

const PageLayout = ({
  children,
  className,
  hideNav,
}: {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
}) => {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between mx-auto ${className ?? ""}`}
    >
      <Header hide={hideNav} />
      <div className={`w-full ${hideNav ? "" : "max-w-[960px]"}`}>
        {children}
      </div>
      <Footer hide={hideNav} />
    </main>
  );
};

export default PageLayout;
