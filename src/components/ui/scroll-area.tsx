import * as React from 'react';

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    className={`relative overflow-hidden ${className}`}
    {...props}
    ref={ref}
  >
    <div className='h-full w-full overflow-auto rounded-[inherit]'>
      {children}
    </div>
    <ScrollBar />
  </div>
));
ScrollArea.displayName = 'ScrollArea';

const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: 'vertical' | 'horizontal' }
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <div
    ref={ref}
    className={`flex touch-none select-none transition-colors ${
      orientation === 'vertical'
        ? 'h-full w-2.5 border-l border-l-transparent p-[1px]'
        : 'h-2.5 flex-col border-t border-t-transparent p-[1px]'
    } ${className}`}
    {...props}
  >
    <div className='relative flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800' />
  </div>
));
ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };
