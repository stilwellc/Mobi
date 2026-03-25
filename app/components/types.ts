export interface SectionItem {
  name: string;
  tag: string;
  description: string;
  href?: string;
  url?: string;
  handle?: string;
  wip?: boolean;
}

export interface Section {
  id: string;
  label: string;
  accent: string;
  tagline: string;
  description: string;
  items: SectionItem[];
}
