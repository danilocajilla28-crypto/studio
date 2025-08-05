'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { userProfileData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function WelcomePage() {
    const router = useRouter();

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd save this data.
        // For now, we'll just navigate to the dashboard.
        router.push('/dashboard');
    };

  return (
    <Card className="w-full max-w-lg bg-card/60 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to CourseCompass!</CardTitle>
        <CardDescription>Let&apos;s set up your profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
            <div className="flex justify-center">
                <Avatar className="w-24 h-24 border-4 border-primary">
                    <AvatarImage src={userProfileData.avatar} alt={userProfileData.name} />
                    <AvatarFallback>{userProfileData.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={userProfileData.name} placeholder="e.g., Alex Doe" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="student-id">Student ID</Label>
                <Input id="student-id" defaultValue={userProfileData.id} placeholder="e.g., 2024-01234" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" defaultValue={userProfileData.bio} rows={3} placeholder="Tell us a little about yourself..." />
            </div>
             <Button type="submit" className="w-full">
                Save and Continue
              </Button>
        </form>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  );
}
