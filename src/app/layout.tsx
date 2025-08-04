import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/themecontext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://templates.manta.digital';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Infinite 3D Cosine Terrain Generator',
  description: 'Realtime-generated 3D cosine surface terrain with 120fps smooth animations, extensive parameter configuration, and infinite terrain generation using Three.js.',
  openGraph: {
    title: 'Infinite 3D Cosine Terrain Generator',
    description: 'Realtime-generated 3D cosine surface terrain with 120fps smooth animations, extensive parameter configuration, and infinite terrain generation using Three.js.',
    url: '/',
    siteName: 'Infinite 3D Cosine Terrain Generator',
    images: [
      {
        url: '/image/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Infinite 3D Cosine Terrain Generator OG Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var stored = localStorage.getItem('ui-theme');
                if (stored) {
                  document.documentElement.classList.add(stored);
                } else {
                  var media = window.matchMedia('(prefers-color-scheme: dark)');
                  document.documentElement.classList.add(media.matches ? 'dark' : 'light');
                }
              } catch (e) {}
            })();`,
          }}
        />
        <link rel="icon" type="image/png" href="/assets/logo/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-200 ease-in-out`}
      >
        <ThemeProvider
          defaultTheme="dark" 
          storageKey="ui-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
