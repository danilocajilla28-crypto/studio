'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignupPage() {
    const router = useRouter();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd have signup logic here.
        // For now, we'll just navigate to the welcome page.
        router.push('/welcome');
    };

  return (
    <Card className="w-full max-w-md bg-card/60 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Join CourseCompass to organize your academic life.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="alex@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
           <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="w-full text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
