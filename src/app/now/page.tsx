import PageLayout from "@/components/PageLayout";

const NowPage = () => {
  return (
    <PageLayout>
      <main className="w-full flex flex-col justify-center gap-8 px-4 py-8 md:py-6">
        <h1 className="font-mono uppercase">What I’m doing now</h1>
        <ul className="list-disc list-inside">
          <li>Working on some pet projects </li>
          <li>Figuring out how to sell the posters</li>
          <li>Working in ZingCoach</li>
          <li>Just quited bouldering and open for a new activity</li>
          <li>Looking for a squash partner</li>
          <li>
            Strugling with reading this year (
            <a
              href="https://literal.club/kkrll/goal/kiryl-ks-2023-reading-goal-ukcy0m3"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              9
            </a>{" "}
            in 2025)
          </li>
          <li>Rebuilding this website</li>
        </ul>

        <p>Last updated November 7, 2025</p>

        <p className="text-foreground-07">
          This is a "
          <a href="https://nownownow.com/about" className="underline">
            now page
          </a>
          ", and you should make one too.
        </p>
      </main>
    </PageLayout>
  );
};

export default NowPage;
