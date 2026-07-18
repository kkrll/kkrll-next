---
name: verify
description: Build, launch, and drive kkrll-next for runtime verification
---

# Verifying kkrll-next

- The user usually already has `bun run dev` running on :3000 — reuse it, it
  hot-reloads edits. A second `bun run dev` fails on the `.next/dev/lock`.
- Never `bun run build` locally — it breaks the `public/` symlinks (see CLAUDE.md).
- Drive with `playwright-core` (bun add it in the scratchpad) plus the cached
  headless shell:
  `~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell`
  (the `chromium-*` dir holds "Google Chrome for Testing.app", not the
  `chrome-mac/Chromium.app` path playwright-core guesses).
- Gotcha: the homepage has a global keydown handler (home-item navigation), so
  keyboard-activating a button with Enter can instead navigate to the currently
  selected project. Use mouse clicks or `dispatchEvent` for buttons.
- Hero portrait flow: hovering "Kiryl" primes it, click opens, Escape / scroll /
  click closes. Click latency is measurable via the Event Timing API
  (`PerformanceObserver` with `type: "event"`; entries under 16ms are dropped).
