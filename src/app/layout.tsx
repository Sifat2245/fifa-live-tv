import type { Metadata } from "next";
import { Inter, Barlow_Condensed, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NoInspect from "@/components/NoInspect";
import { ThemeProvider } from "@/lib/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FIFA 2026 Live - Watch World Cup Matches Free",
    template: "%s - FIFA 2026 Live",
  },
  description:
    "Watch every FIFA World Cup 2026 match live. Free HD streaming from global broadcasters. No registration required.",
  keywords: [
    "FIFA World Cup 2026",
    "World Cup live stream",
    "football live",
    "soccer streaming",
    "World Cup 2026",
  ],
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏆</text></svg>',
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${barlowCondensed.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* Prevent theme flash — runs before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t;try{t=localStorage.getItem("fifa-theme")}catch(e){}if(t==="light"||(!t&&matchMedia("(prefers-color-scheme:light)").matches)){document.documentElement.classList.remove("dark");document.documentElement.classList.add("light")}})()`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-surface text-text-secondary font-sans">
        <ThemeProvider>
          <NoInspect />
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border-default bg-surface">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span className="text-gold font-semibold">FIFA 2026 Live</span>
                  <span className="text-text-subtle">|</span>
                  <span>&copy; {new Date().getFullYear()}</span>
                </div>
                <p className="text-xs text-text-muted">
                  Not affiliated with FIFA. Streams sourced from publicly available channels.
                </p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
