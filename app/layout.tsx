import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";

import theme from "./theme";
import "./globals.css";
import CssBaseline from "@mui/material/CssBaseline";

export const metadata: Metadata = {
  title: "Time Card",
  description: "Time Card estimates for pay period",
  openGraph: {
    type: "website",
    url: "https://timecard.dangude.com",
    title: "Time Card",
    description: "Time Card estimates for pay period",
  },
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

export default RootLayout;
