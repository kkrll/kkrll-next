import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { PHProvider } from "@/providers/posthog-provider";
import ThemeProvider from "@/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
  },
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
