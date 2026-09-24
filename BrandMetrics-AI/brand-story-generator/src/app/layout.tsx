import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandStory AI – AI-Powered Personal Brand Story Generator",
  description:
    "Instantly create a powerful personal brand story, LinkedIn headlines, bios, and content ideas with AI. Perfect for freelancers, creators, and small business owners.",
  keywords: ["personal brand", "AI story generator", "LinkedIn bio", "freelancer branding"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[var(--border)] py-6 text-center text-sm text-muted-foreground">
            <div className="max-w-6xl mx-auto px-4">
              <p>© {new Date().getFullYear()} BrandStory AI. Craft your story. Build your legacy.</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
