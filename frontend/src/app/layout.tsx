import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { cookies } from "next/headers";
import AppDataContainer from "@/containers/app-data-contaienr";

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
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  return (
    <html lang="ua" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider token={token}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <AppDataContainer>
                {children}
                <Toaster />
              </AppDataContainer>
            </QueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
