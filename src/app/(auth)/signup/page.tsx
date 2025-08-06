
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GoogleIcon } from '@/components/ui/google-icon';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useUserData } from '@/hooks/use-user-data';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SignupPage() {
    const router = useRouter();
    const { setUserProfile } = useUserData();

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState('https://placehold.co/100x100.png');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        // Save profile data
        setUserProfile({
            name,
            id: studentId,
            bio,
            avatar,
        });
        // In a real app, you'd also have signup logic here (e.g. call to Firebase Auth).
        // For now, we'll just navigate to the welcome page to set up courses.
        router.push('/welcome');
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleGoogleSignIn = async () => {
        const { user, error } = await signInWithGoogle();
        if (user) {
            // If signing up with Google, we might not have all profile info yet.
            // Still go to welcome page. We could pre-fill name/avatar from Google profile.
             if (user.displayName) setName(user.displayName);
             if (user.photoURL) setAvatar(user.photoURL);

             // Since we can't guarantee all info is filled, we still go to welcome
             // to complete the setup. In a real app, you might merge these steps.
             setUserProfile({
                name: user.displayName || '',
                avatar: user.photoURL || 'https://placehold.co/100x100.png',
                id: '',
                bio: '',
            });

            router.push('/welcome');
        }
        if (error) {
            // You can show a toast notification here
            console.error(error);
        }
    };

  return (
    <Card className="w-full max-w-2xl bg-card/60 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Join CourseCompass to organize your academic life.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-6">
            <h3 className="text-lg font-medium text-center">Step 1: Your Profile</h3>
            <div className="flex flex-col items-center gap-4">
                <Avatar className="w-24 h-24 border-4 border-primary">
                    <AvatarImage src={avatar} alt={name} data-ai-hint="profile picture" />
                    <AvatarFallback>{name ? name.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Photo
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Alex Doe" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input id="student-id" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g., 2024-01234" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell us a little about yourself..." />
            </div>

            <Separator />

            <h3 className="text-lg font-medium text-center">Step 2: Account Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@example.com" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
            </div>

          <Button type="submit" className="w-full">
            Create Account & Continue
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
         <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <GoogleIcon className="mr-2 h-4 w-4" />
            Continue with Google
        </Button>
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
