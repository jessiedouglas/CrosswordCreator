import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="size-full">
      <body className="size-full">
        {children}
      </body>
    </html>
  );
}
