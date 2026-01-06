import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <meta charSet="UTF-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.imgur.com" />
        <link
          rel="preload"
          href="https://i.imgur.com/M9BDKmO.png"
          as="image"
        />
        <link
          rel="preload"
          href="https://i.imgur.com/hJxdJ79.jpg"
          as="image"
          // @ts-ignore
          fetchpriority="high"
        />
        <link rel="preload" href="https://i.imgur.com/neCtaaD.jpg" as="image" />

        <meta
          name="description"
          content="Gerador de conteúdo RPG para Demon Slayer: armas, personagens, Onis, técnicas e mais. Forja lendas para suas campanhas de mesa."
        />
        <meta name="theme-color" content="#8b5cf6" />
        
        {/* Fonts are loaded in globals.css via @import, but preconnect helps here */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}