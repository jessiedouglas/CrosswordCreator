import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-fit w-full min-h-[100%]">
      <body className="size-full">
        {children}
      </body>
    </html>
  );
}
