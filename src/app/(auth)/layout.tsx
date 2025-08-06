
'use client';
import { UserDataProvider } from '@/hooks/use-user-data';
import { Compass } from 'lucide-react';

function AuthLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
          <Compass className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-semibold font-headline">CourseCompass</h1>
      </div>
      {children}
    </main>
  );
}


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserDataProvider>
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </UserDataProvider>
  );
}
