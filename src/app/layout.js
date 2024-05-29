import { Inter } from "next/font/google";
import "./globals.css";



export const metadata = {
  title: "Menu Advisor",
  description: "Software engineering project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg"/>
      </head>
      <body>{children}</body>
    </html>
  );
}
