import Header from "./header";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between  max-w-[1200px] mx-auto">
      <Header />
      {children}
    </main>
  );
};

export default PageLayout;
