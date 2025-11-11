import Link from "next/link";

const Footer = () => {
  const author = {
    name: "Kiryl Kavalenka",
    summary: "Product Designer",
  };

  const social = {
    linkedin: "https://www.linkedin.com/in/kkrll",
    medium: "https://medium.com/@kkrll",
  };

  return (
    <footer
      className={`flex flex-col md:flex-row p-8 md:p-6 gap-8 justify-between mt-24 mb-4 w-full mx-auto box-border`}
    >
      <Link href="/" className="no-underline">
        <h4 className="mb-2 text-sm font-sans font-semibold">{author.name}</h4>
        <p className="font-sans mt-0 text-foreground-07 text-sm">
          {author.summary}
        </p>
      </Link>

      <div className="flex flex-row font-medium [&>a:not(:last-child)]:mr-4 [&>a]:text-sm [&>a]:no-underline">
        <Link href="/now">Now</Link>
        <a href={social.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={social.medium} target="_blank" rel="noreferrer">
          Medium
        </a>
        {/* <Link href="/rss.xml">RSS</Link> */}
      </div>
    </footer>
  );
};

export default Footer;
