import Footer from "./Footer";
import Header from "./header";

const PageLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between max-w-[960px] mx-auto ${className}`}
    >
      <Header />
      {children}
      <Footer />
    </main>
  );
};

export default PageLayout;
