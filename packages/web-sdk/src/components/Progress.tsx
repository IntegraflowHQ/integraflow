import { h } from 'preact';

export default function Progress({
  progress,
  bgColor = '#050505',
}: {
  progress: number;
  bgColor?: string;
}) {
  return (
    <div className='w-full h-1 rounded-full bg-slate-200'>
      <div
        className='h-1 duration-500 rounded-full transition-width'
        style={{
          backgroundColor: bgColor,
          width: `${Math.floor(progress * 100)}%`,
        }}
      ></div>
    </div>
  );
}
