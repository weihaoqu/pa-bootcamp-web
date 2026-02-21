import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/layout/TopNav";
import Sidebar from "@/components/layout/Sidebar";
import Providers from "@/components/Providers";
import PageVisitTracker from "@/components/PageVisitTracker";

export const metadata: Metadata = {
  title: "Program Analysis Bootcamp",
  description:
    "An interactive bootcamp for learning program analysis techniques: ASTs, dataflow, abstract interpretation, and security analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <TopNav />
          <div className="flex pt-14">
            <Sidebar />
            <main className="ml-[280px] min-h-[calc(100vh-56px)] flex-1 p-6">
              {children}
            </main>
          </div>
          <PageVisitTracker />
        </Providers>
      </body>
    </html>
  );
}
