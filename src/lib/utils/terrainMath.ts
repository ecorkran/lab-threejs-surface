import * as THREE from 'three';

export interface TerrainConfig {
  frequency: number;
  amplitude: number;
  equation: 'multiplicative' | 'additive';
  xAmplitudeMultiplier: number;
  zAmplitudeMultiplier: number;
  enableAmplitudeVariation: boolean;
  amplitudeVariationFrequency: number;
  amplitudeVariationIntensity: number;
  seed: number;
}

export const createTerrainCalculator = (config: TerrainConfig) => {
  return (worldX: number, worldZ: number): number => {
    const cosX = Math.cos(worldX * config.frequency + config.seed);
    const cosZ = Math.cos(worldZ * config.frequency + config.seed);
    
    // Calculate local amplitude variation
    let localAmplitude = config.amplitude;
    if (config.enableAmplitudeVariation) {
      const amplitudeNoise = Math.sin(worldX * config.amplitudeVariationFrequency + config.seed * 0.7) * 
                             Math.cos(worldZ * config.amplitudeVariationFrequency + config.seed * 1.3);
      const amplitudeVariationFactor = 1 + (amplitudeNoise * config.amplitudeVariationIntensity);
      localAmplitude *= amplitudeVariationFactor;
    }
    
    return config.equation === 'additive'
      ? (config.xAmplitudeMultiplier * cosX + config.zAmplitudeMultiplier * cosZ) * localAmplitude * 0.5
      : (config.xAmplitudeMultiplier * cosX) * (config.zAmplitudeMultiplier * cosZ) * localAmplitude;
  };
};

export const validateTerrainFrequency = (frequency: number, terrainScale: number): void => {
  const wavelength = (2 * Math.PI) / frequency;
  const tileWavelengthRatio = wavelength / terrainScale;
  
  const fractionalPart = tileWavelengthRatio % 1;
  if (fractionalPart > 0.2 && fractionalPart < 0.8) {
    console.warn(
      `Terrain frequency ${frequency} may cause tile boundary artifacts. ` +
      `Wavelength/tile ratio: ${tileWavelengthRatio.toFixed(2)}. ` +
      `Consider frequencies that create integer or half-integer ratios.`
    );
  }
};

// Legacy function for backward compatibility
export function calculateTerrainHeight(x: number, z: number, frequency: number = 0.02, amplitude: number = 50): number {
  return Math.cos(x * frequency) * Math.cos(z * frequency) * amplitude;
}