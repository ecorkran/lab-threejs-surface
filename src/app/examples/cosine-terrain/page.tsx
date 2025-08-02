import React from 'react';
import { CosineTerrainCard } from '@/components/cards';

export default function CosineTerrainPage() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Cosine Terrain Card Test</h1>
      <div className="w-full h-96 border">
        <CosineTerrainCard className="w-full h-full" />
      </div>
    </div>
  );
}