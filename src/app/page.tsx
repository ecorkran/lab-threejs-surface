import { Container } from '@/components';
import Layout from '@/components/layout';
import { CosineTerrainCard } from '@/components/cards';

export default function Home() {
  return (
    <Layout>
      {/* Hero */}
      <Container className="pt-20 pb-10 text-center space-y-4">
        <h1 className="text-5xl font-bold">3D Cosine Terrain Demo</h1>
        <p className="text-muted-foreground text-lg">
          Experience an infinite cosine surface rendered in retro wireframe.
        </p>
      </Container>

      {/* Cosine Terrain Demo */}
      <Container className="pb-20">
        <CosineTerrainCard className="w-full h-[600px]" />
      </Container>
    </Layout>
  );
}
