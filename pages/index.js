import Head from 'next/head';
import MarkdownBrowser from '../src/components/MarkdownBrowser';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>My Project Markdown Browser</title>
        <meta name="description" content="Browse my project markdown files" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          My Projects
        </h1>
        <MarkdownBrowser />
      </main>
    </div>
  );
}