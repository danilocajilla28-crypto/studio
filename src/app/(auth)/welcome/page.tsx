'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { userProfileData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type CourseInput = {
    id: number;
    name: string;
    instructor: string;
    schedule: string;
};

export default function WelcomePage() {
    const router = useRouter();
    const [courses, setCourses] = useState<CourseInput[]>([
        { id: 1, name: '', instructor: '', schedule: '' }
    ]);

    const handleCourseChange = (id: number, field: keyof Omit<CourseInput, 'id'>, value: string) => {
        setCourses(courses.map(course => 
            course.id === id ? { ...course, [field]: value } : course
        ));
    };

    const addCourse = () => {
        setCourses([...courses, { id: Date.now(), name: '', instructor: '', schedule: '' }]);
    };

    const removeCourse = (id: number) => {
        setCourses(courses.filter(course => course.id !== id));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd save this data.
        // For now, we'll just navigate to the dashboard.
        router.push('/dashboard');
    };

  return (
    <Card className="w-full max-w-2xl bg-card/60 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Welcome to CourseCompass!</CardTitle>
        <CardDescription>Let&apos;s set up your profile and schedule.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-8">
            <div className="space-y-6">
                 <div className="flex justify-center">
                    <Avatar className="w-24 h-24 border-4 border-primary">
                        <AvatarImage src={userProfileData.avatar} alt={userProfileData.name} />
                        <AvatarFallback>{userProfileData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={userProfileData.name} placeholder="e.g., Alex Doe" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="student-id">Student ID</Label>
                        <Input id="student-id" defaultValue={userProfileData.id} placeholder="e.g., 2024-01234" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" defaultValue={userProfileData.bio} rows={3} placeholder="Tell us a little about yourself..." />
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Your Courses</h3>
                    <p className="text-sm text-muted-foreground">Add the courses you are taking this semester.</p>
                </div>
                <div className="space-y-4">
                     {courses.map((course, index) => (
                        <div key={course.id} className="p-4 border rounded-lg space-y-4 relative">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`course-name-${course.id}`}>Course Name</Label>
                                    <Input id={`course-name-${course.id}`} value={course.name} onChange={e => handleCourseChange(course.id, 'name', e.target.value)} placeholder="e.g., Introduction to AI" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`instructor-${course.id}`}>Instructor Name</Label>
                                    <Input id={`instructor-${course.id}`} value={course.instructor} onChange={e => handleCourseChange(course.id, 'instructor', e.target.value)} placeholder="e.g., Prof. Ada Lovelace" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`schedule-${course.id}`}>Schedule</Label>
                                <Textarea id={`schedule-${course.id}`} value={course.schedule} onChange={e => handleCourseChange(course.id, 'schedule', e.target.value)} placeholder="e.g., Mon/Wed/Fri 10:00 AM - 11:30 AM" rows={2}/>
                            </div>
                            {courses.length > 1 && (
                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeCourse(course.id)}>
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" onClick={addCourse}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Course
                </Button>
            </div>
            
             <Button type="submit" size="lg" className="w-full">
                Save and Continue to Dashboard
              </Button>
        </form>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  );
}
