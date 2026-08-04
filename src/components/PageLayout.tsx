import { ViewTransition } from "react";
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
      {/* only the content crossfades on navigation — header and footer sit
          outside so they stay put. default="none" keeps this out of unrelated
          transitions (the theme toggle, which animates the root snapshot). */}
      <ViewTransition enter="page-fade" exit="page-fade" default="none">
        <div className={`w-full ${hideNav ? "" : "max-w-[960px]"}`}>
          {children}
        </div>
      </ViewTransition>
      <Footer hide={hideNav} />
    </main>
  );
};

export default PageLayout;
