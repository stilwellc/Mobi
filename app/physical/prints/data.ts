export interface Print3D {
  id: string;
  name: string;
  description: string;
  notes: string;
  stlPath: string;
  downloadable: boolean;
  details: {
    material?: string;
    dimensions?: string;
    status?: string;
    printTime?: string;
    layerHeight?: string;
    infill?: string;
  };
}

export const prints: Print3D[] = [
  {
    id: 'wall-sconce',
    name: 'Wall Sconce',
    description: 'A wall-mounted shade that turns a bare fixture into a soft, indirect wash of light.',
    notes:
      'I wanted the print itself to be the finished object — the shell is the diffuser, so there is no glass, no fabric, no post-processing. Most of the work was in the wall thickness: thin enough to glow, thick enough to hide the bulb.',
    stlPath: '/models/wall_sconce.stl',
    downloadable: true,
    details: {
      material: 'PLA',
      dimensions: '199 × 140 × 191 mm',
      status: 'Printed',
    },
  },
  {
    id: 'tolomeo-scaled',
    name: 'Tolomeo, Scaled',
    description: 'A scaled study of Artemide’s Tolomeo desk lamp — the balance-arm geometry at desk-model size.',
    notes:
      'I printed this to understand the Tolomeo’s balance-arm mechanism in my hands instead of on a screen — how the pivot spacing and proportions actually resolve. It’s a study of a protected design, so it stays a study: you can look at it here, but I don’t distribute the file.',
    stlPath: '/models/tolomeo_fullsize_scaled_143.stl',
    downloadable: false,
    details: {
      material: 'PLA',
      dimensions: '57 × 23 × 65 mm',
      status: 'Printed',
    },
  },
  {
    id: 'usm-haller-thread-foot',
    name: 'USM Haller Thread Foot',
    description: 'A replacement threaded leveling foot for the USM Haller modular system.',
    notes:
      'One of the leveling feet on my Haller unit needed replacing, and the thread is the whole problem — I measured it, modeled it, and printed until it screwed in like the original. The clearance tuning taught me more about FDM tolerances than anything I had printed before.',
    stlPath: '/models/USM_Haller_thread_foot.stl',
    downloadable: true,
    details: {
      material: 'PLA',
      dimensions: '36 × 36 × 32 mm',
      status: 'In use',
    },
  },
];
