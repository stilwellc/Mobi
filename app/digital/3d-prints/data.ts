export interface Print3D {
  id: string;
  name: string;
  description: string;
  stlPath: string;
  details: {
    material?: string;
    printTime?: string;
    dimensions?: string;
    layerHeight?: string;
    infill?: string;
  };
}

export const prints: Print3D[] = [
  {
    id: 'usm-haller-thread-foot',
    name: 'USM Haller Thread Foot',
    description: 'Replacement thread foot for the USM Haller modular furniture system — precision-modeled for a perfect fit.',
    stlPath: '/models/USM_Haller_thread_foot.stl',
    details: {
      material: 'PLA',
    },
  },
  {
    id: 'tolomeo-scaled',
    name: 'Tolomeo Fullsize Scaled',
    description: 'A scaled replica of the Artemide Tolomeo desk lamp — the iconic balance-arm design faithfully reproduced.',
    stlPath: '/models/tolomeo_fullsize_scaled_143.stl',
    details: {
      material: 'PLA',
    },
  },
];
