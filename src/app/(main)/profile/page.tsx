'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUserData } from '@/hooks/use-user-data';
import { QrCode, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { userProfile, setUserProfile } = useUserData();

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, you'd probably have a more robust way of updating state
      // For this prototype, we're directly setting the values from the form fields.
      const form = e.target as HTMLFormElement;
      const newName = (form.elements.namedItem('name') as HTMLInputElement).value;
      const newBio = (form.elements.namedItem('bio') as HTMLTextAreaElement).value;

      setUserProfile({
        ...userProfile,
        name: newName,
        bio: newBio,
      });
  }

  return (
    <div>
      <PageHeader title="User Profile" />
      <Card className="bg-card/60 backdrop-blur-sm max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="relative w-32 h-32 mx-auto">
            <Link href="/welcome">
                <Avatar className="w-32 h-32 border-4 border-primary">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} data-ai-hint="profile picture" />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </Link>
            <Button size="icon" className="absolute bottom-1 right-1 rounded-full">
                <Share2 className="w-5 h-5" />
            </Button>
          </div>
          <CardTitle className="mt-4 text-3xl font-headline">{userProfile.name}</CardTitle>
          <CardDescription>ID: {userProfile.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue={userProfile.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" defaultValue={userProfile.bio} rows={4} />
            </div>
            <div className="flex justify-between items-center pt-4">
               <Button variant="outline" type="button">
                  <QrCode className="mr-2"/>
                  Share Profile
                </Button>
               <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
