import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PHProvider } from "@/providers/posthog-provider";
import ThemeProvider from "@/providers/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "kkrll",
  description: "product designer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=recia@1,2&display=swap"
          rel="stylesheet"
        />
        <script
          /** biome-ignore lint/security/noDangerouslySetInnerHtml: make sure theme is loaded on client-side */
          dangerouslySetInnerHTML={{
            __html: `
            try {
              const theme = JSON.parse(localStorage.getItem("theme") || '{}').state?.theme || 'dark';
              if (theme === "dark") {
                document.documentElement.classList.add("dark")
              }
            } catch (e) {}
          `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <PHProvider>
            {children}
            <Analytics />
            <SpeedInsights />
          </PHProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
