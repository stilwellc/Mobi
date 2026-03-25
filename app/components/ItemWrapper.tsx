'use client';

import Link from 'next/link';
import { SectionItem } from './types';

export default function ItemWrapper({ item, children, style }: {
  item: SectionItem;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  if (item.url) {
    return <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', ...style }}>{children}</a>;
  }
  if (item.href) {
    return <Link href={item.href} style={{ textDecoration: 'none', color: 'inherit', ...style }}>{children}</Link>;
  }
  return <div style={style}>{children}</div>;
}
