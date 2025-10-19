import Footer from "./Footer";
import Header from "./header";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between  max-w-[960px] mx-auto">
      <Header />
      {children}
      <Footer />
    </main>
  );
};

export default PageLayout;
