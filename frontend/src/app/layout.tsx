import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import TranslationProvider from "@/providers/translation-provider";
import { cookies } from "next/headers";
import { SocketProvider } from "@/providers/socket-provider";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jewel Wax",
  description: "Jewel Wax CRM",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;

  return (
    <html lang="ua" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased h-screen overflow-hidden`}
      >
        <TranslationProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <SocketProvider token={token}>
                {children}
                <Toaster
                  position="top-right"
                  offset={{ top: "5vh", right: "36px" }}
                  richColors
                  toastOptions={{
                    classNames: {
                      toast: "!py-3",
                    },
                  }}
                />
              </SocketProvider>
            </QueryProvider>
          </ThemeProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
