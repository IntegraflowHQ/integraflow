import { h, VNode } from 'preact';
import { cleanHtml } from '../utils/clean-html';

export interface HeaderProps {
  title: string;
  description?: string;
  centered?: boolean;
  color?: string;
}

export function Header({
  title,
  description,
  centered,
  color = '#050505',
}: HeaderProps): VNode {
  return (
    <header className={`space-y-2 w-min min-w-full ${centered ? 'text-center' : ''}`}>
      <div
        style={{ color }}
        className='text-sm font-semibold leading-[22px]'
        dangerouslySetInnerHTML={{ __html: cleanHtml(title) }}
      />
      {description && (
        <div
          style={{ color }}
          className='text-xs font-normal leading-[19px]'
          dangerouslySetInnerHTML={{ __html: cleanHtml(description) }}
        />
      )}
    </header>
  );
}
