import * as React from 'react';
import { cn } from '@/lib/utils';

export const GoogleIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('w-4 h-4', className)}
    {...props}
  >
    <title>Google</title>
    <path
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.84-4.84 1.84-5.84 0-10.62-4.7-10.62-10.62s4.78-10.62 10.62-10.62c3.32 0 5.62 1.36 6.96 2.62l-2.52 2.52c-.8-1-2.2-1.62-4.44-1.62-3.62 0-6.52 3-6.52 6.62s2.9 6.62 6.52 6.62c4.22 0 5.92-2.82 6.12-4.52h-6.12z"
      fill="currentColor"
    />
  </svg>
);
