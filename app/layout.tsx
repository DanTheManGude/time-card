import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Card",
  description: "Time Card estimates for pay period",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
