import PageLayout from "@/components/PageLayout";

const NowPage = () => {
  return (
    <PageLayout>
      <section className="w-full px-default flex flex-col justify-center gap-8 max-w-[560px]">
        <h1 className="font-mono uppercase">What I'm doing now</h1>
        <ul className="list-disc ml-5 space-y-2">
          <li>Quited bouldering and open for a new activity</li>
          <li>Looking for a squash partner</li>
          <li>
            Strugling with reading this year (
            <a
              href="https://literal.club/kkrll/goals"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              9
            </a>{" "}
            in 2025)
          </li>
          <li>Working on some pet projects </li>
          <li>Figuring out how to sell the posters</li>
          <li>Working in ZingCoach</li>
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
      </section>
    </PageLayout>
  );
};

export default NowPage;
