export interface SectionItem {
  name: string;
  tag: string;
  description: string;
  href?: string;
  url?: string;
  handle?: string;
  logoStyle?: Record<string, string | number>;
  meta?: {
    year?: string;
    stack?: string;
    material?: string;
    status?: string;
  };
}

export interface Section {
  id: string;
  label: string;
  accent: string;
  tagline: string;
  description: string;
  items: SectionItem[];
}
