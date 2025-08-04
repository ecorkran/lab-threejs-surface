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
          <div className="prose prose-lg max-w-none dark:prose-invert mx-4">
            <p className="text-lg leading-relaxed">
              The <Link href="https://github.com/ecorkran/lab-threejs-surface" target="_blank" rel="noopener noreferrer" className="underline">Cosine Terrain Generator</Link> is a realtime 3D visualization that uses a mathematical function to procedurally generate an infinite surface of
              rolling hills.  
            </p>
          </div>

          <BaseCard className="p-6 bg-cyan-100/50 dark:bg-cyan-950/30 text-cyan-900 dark:text-cyan-200">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-300">How Does It Work?</h3>
            <p className="mb-1">
              We generate the terrain in a simulated world, defined in three dimensions just like our physical world. 
            </p>
            <p className="mb-1">
              To make a three-dimensional surface, we use a mathematical function to determine the height at any point 
              in our world.  We call the left-right direction X, and the direction into and out of your screen Z.  You
              can imagine that these create a flat grid extending into your screen.  At each point where lines cross, we
              apply our mathematical function to calculate the height of that point.  We create a &apos;mesh&apos; of lines using 
              these heights which gives us a three-dimensional surface.  The lines you see are the outline of the mesh.
            </p>
            <p className="mb-1">
              The function we apply by default is y = cos(x) + cos(z).  We further modify the function to y = a*cos(ix) + b*cos(jy).
              It looks worse but is similar.  Increasing i or j increases the frequency (causes faster waves) in its respective
              direction.  Increasing a or b increases the size of the waves in that direction.   
            </p>
            <p className="mb-1">
              By continuously calculating these heights and updating the mesh in realtime, we create the smooth, infinite 
              terrain animation you see - all running at 60-120fps in your browser.              
            </p>
          </BaseCard>

          <BaseCard className="p-6 bg-gradient-to-br from-green-50 to-green-200 dark:from-green-950/20 dark:to-green-800/20">
            <h3 className="text-xl font-semibold mb-0 text-green-900 dark:text-green-200">
              Explore More Features & Create Your Own
            </h3>
            <p className="text-green-900 dark:text-green-200 mb-1">
              This project was created from the manta-templates Next.js template.  It&apos;s part of a new collection of web components
              and layouts.  It&apos;s card-based, with grids that actually work, 3D with Three.js, Radix themes, videos, and more. 
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
        </div>
      </div>
    </Container>
    </Layout>
  );
};

export default AboutPage; 