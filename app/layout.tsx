import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAQO ATAP | Charge Your EV On Free Sunlight — Not On TNB",
  description:
    "Home EV charging is pushing your TNB bill up. Rooftop solar under NEM turns your driveway into your own fuel station — up to 90% off your bill. Free home assessment, ST Class A & CIDB G7 certified.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
