import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nyx Videos – AI Video Studio",
  description:
    "Project-based AI video generation with true continuity, face lock, voice cloning, and music video support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#07070c] text-[#ededf2]">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-[#1c1c28] bg-[#0a0a10]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center font-bold text-white text-sm">
                  N
                </div>
                <span className="font-semibold tracking-tight text-lg">
                  Nyx Videos
                </span>
              </div>
              <nav className="flex items-center gap-6 text-sm text-[#8b8b9e]">
                <span className="hover:text-white transition-colors cursor-default">
                  Projects
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-violet-900/50 text-violet-300 border border-violet-800">
                  v1.0
                </span>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
