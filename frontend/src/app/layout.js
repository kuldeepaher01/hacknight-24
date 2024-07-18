import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import { FarmProvider } from "@/context/farmcontext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "InvestOps",
  description: "InvestOps is a platform for managing your investments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <FarmProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header/>
          {children}{" "}
        </ThemeProvider>
        </FarmProvider>
      </body>
    </html>
  );
}
