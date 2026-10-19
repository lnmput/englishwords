import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '单词临摹字帖生成器',
  description: '输入单词，生成 A4 可打印的英文临摹练习纸。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Andika:wght@400;700&family=Comic+Neue:wght@400;700&family=Quicksand:wght@500;700&family=Nunito:wght@500;700&family=Fredoka:wght@400;500&family=Playpen+Sans:wght@400;600&family=Patrick+Hand&family=Poppins:wght@500;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
