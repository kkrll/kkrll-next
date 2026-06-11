import dynamic from "next/dynamic";

// Interactive components that articles can embed from MDX.
// dynamic() splits each one into its own chunk, and MDXRemote only renders
// what an article references — so a demo's JS is fetched only on the
// article that uses it, not on every /writings/[slug] page.
export const articleComponents = {
  StateMachineDemo: dynamic(
    () => import("@/components/articles/state-machine-bar/Demo"),
  ),
};
