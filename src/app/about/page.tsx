import React from 'react';
import Link from 'next/link';
import { BaseCard } from '@/components/cards';
import Container from '@/components/container';
import Layout from '@/components/layout';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <Container className="py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About the Cosine Terrain Generator</h1>
          </div>

        <div className="space-y-8">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-lg leading-relaxed">
              The <Link href="https://github.com/ecorkran/lab-threejs-surface" target="_blank" rel="noopener noreferrer" className="underline">Cosine Terrain Generator</Link> is a realtime 3D visualization that uses a cosine-based mathematical function to procedurally generate an infinite surface of
              rolling hills.  Numerous parameters in CosineTerrainCard can be adjusted to create a variety of terrain shapes and patterns.
            </p>
            <p className="text-lg leading-relaxed">
              This project was created with <Link href="https://github.com/manta-digital/manta-templates/" target="_blank" rel="noopener noreferrer" className="underline">manta-templates</Link> and the <Link href="https://github.com/ecorkran/ai-project-guide" target="_blank" rel="noopener noreferrer" className="underline">ai-project-guide</Link>.
            </p>
          </div>

          <BaseCard className="p-6 bg-gradient-to-br from-green-50 to-green-200 dark:from-green-950/20 dark:to-green-800/20">
            <h3 className="text-xl font-semibold mb-0 text-green-900 dark:text-green-200">
              Explore More Features & Create Your Own
            </h3>
            <p className="text-green-900 dark:text-green-200 mb-1">
              This template is part of a comprehensive collection of modern web components and layouts. 
              Discover advanced grid systems, interactive components, animation variants, and many more 
              examples in our full showcase.
            </p>
            <p className="text-green-900 dark:text-green-200 mb-1">
              Intelligence and guidance which enabled the creation of this project was provided by <Link href="https://github.com/ecorkran/ai-project-guide" target="_blank" rel="noopener noreferrer" className="underline">ai-project-guide</Link>.
              Both tools are open source and available on <Link href="https://github.com/manta-digital/manta-templates" target="_blank" rel="noopener noreferrer" className="underline">GitHub</Link>.
            </p>

            <p className="pb-0 mb-0 text-green-900 dark:text-green-200">Create your own:</p>
            <div className="p-4 pt-0 pb-0 border bg-gray-100 dark:bg-gray-800 rounded-lg">
              <pre className="m-4 text-sm text-green-700 dark:text-green-300 overflow-x-auto">
                <code>{`# Pull template instance:
pnpm dlx degit manta-digital/manta-templates/templates/nextjs my-app

# Install dependencies:
cd my-app && pnpm install

# Setup guides:
pnpm run setup-guides`}</code>
              </pre>
            </div>

              <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-3">
                <Link
                    href="https://github.com/ecorkran/lab-threejs-surface"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-700 rounded-full hover:bg-cyan-200 dark:hover:bg-cyan-900/60 transition-colors font-medium w-full sm:w-auto"
                  >
                    This Project on GitHub
                </Link>
                <Link
                  href="https://templates.manta.digital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors font-medium w-full sm:w-auto"
                >
                  Manta Templates
                </Link>
                <Link
                  href="https://github.com/ecorkran/ai-project-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors font-medium w-full sm:w-auto"
                >
                  AI Project Guide
                </Link>
              </div>
          </BaseCard>

          <BaseCard className="p-6 bg-muted/50">
            <h3 className="text-xl font-semibold">Template Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Three.js support included
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Modern Next.js 15 with App Router
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Tailwind CSS v4 with custom theming
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Radix UI components and accessibility
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Responsive grid layouts and card systems
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Dark/light mode support
              </li>
            </ul>
          </BaseCard>

          <div className="text-center">
            <p className="text-muted-foreground">
              Ready to customize this template for your project? Start by exploring the examples 
              and components provided.
            </p>
          </div>
        </div>
      </div>
    </Container>
    </Layout>
  );
};

export default AboutPage; 