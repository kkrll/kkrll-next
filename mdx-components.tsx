import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Image from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Built-in HTML elements with Tailwind styling
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold my-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold my-6">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold my-4">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="my-4 font-mono dark:font-medium leading-[1.6]">
        {children}
      </p>
    ),
    ul: ({ children }) => <ul className="list-disc ml-6 my-4">{children}</ul>,
    ol: ({ children }) => (
      <ol className="list-decimal ml-6 my-4">{children}</ol>
    ),
    li: ({ children }) => <li className="my-2">{children}</li>,
    a: (props) => <a {...props} className="underline hover:no-underline" />,
    img: (props) => (
      <img {...props} className="rounded-lg my-6" alt={props.alt || ""} />
    ),

    // Next.js components
    Link,
    Image,

    ...components,
  };
}
