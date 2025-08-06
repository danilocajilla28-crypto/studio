
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { userProfileData as defaultUserProfileData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useUserData } from '@/hooks/use-user-data';
import type { Course, ScheduleEntry } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CourseInput = Omit<Course, 'id' | 'color'> & { inputId: string; color: string };

const courseColors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 'bg-yellow-500', 'bg-pink-600', 'bg-indigo-600'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = Array.from({ length: 15 }, (_, i) => `${Math.floor(i / 2) + 7}:${i % 2 === 0 ? '00' : '30'} ${i + 7 >= 12 ? 'PM' : 'AM'}`);

export default function WelcomePage() {
    const router = useRouter();
    const { setUserProfile, setCourses: setAppCourses } = useUserData();
    
    const [name, setName] = useState(defaultUserProfileData.name);
    const [studentId, setStudentId] = useState(defaultUserProfileData.id);
    const [bio, setBio] = useState(defaultUserProfileData.bio);

    const [courses, setCourses] = useState<CourseInput[]>([
        { inputId: `course-${Date.now()}`, name: '', instructor: '', schedule: [{ day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM'}], color: courseColors[0] }
    ]);

    const handleCourseChange = (inputId: string, field: keyof Omit<CourseInput, 'inputId' | 'color' | 'schedule'>, value: string) => {
        setCourses(courses.map(course => 
            course.inputId === inputId ? { ...course, [field]: value } : course
        ));
    };

    const handleScheduleChange = (courseId: string, scheduleIndex: number, field: keyof ScheduleEntry, value: string) => {
        setCourses(courses.map(course => {
            if (course.inputId === courseId) {
                const newSchedule = [...course.schedule];
                newSchedule[scheduleIndex] = { ...newSchedule[scheduleIndex], [field]: value };
                return { ...course, schedule: newSchedule };
            }
            return course;
        }));
    };

    const addScheduleEntry = (courseId: string) => {
        setCourses(courses.map(course => {
            if (course.inputId === courseId) {
                return { ...course, schedule: [...course.schedule, { day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM' }] };
            }
            return course;
        }));
    };

    const removeScheduleEntry = (courseId: string, scheduleIndex: number) => {
        setCourses(courses.map(course => {
            if (course.inputId === courseId) {
                const newSchedule = course.schedule.filter((_, index) => index !== scheduleIndex);
                return { ...course, schedule: newSchedule };
            }
            return course;
        }));
    };

    const addCourse = () => {
        setCourses([...courses, { inputId: `course-${Date.now()}`, name: '', instructor: '', schedule: [{ day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM'}], color: courseColors[courses.length % courseColors.length] }]);
    };

    const removeCourse = (id: string) => {
        setCourses(courses.filter(course => course.inputId !== id));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        setUserProfile({
            name,
            id: studentId,
            bio,
            avatar: defaultUserProfileData.avatar
        });

        const formattedCourses: Course[] = courses
            .filter(c => c.name.trim() !== '')
            .map((c, i) => ({
                id: c.name.toLowerCase().replace(/\s/g, '-') || `course-${i}`,
                name: c.name,
                instructor: c.instructor,
                color: c.color,
                schedule: c.schedule,
            }));

        setAppCourses(formattedCourses);
        router.push('/dashboard');
    };

  return (
    <Card className="w-full max-w-3xl bg-card/60 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Welcome to CourseCompass!</CardTitle>
        <CardDescription>Let&apos;s set up your profile and schedule.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-8">
            <div className="space-y-6">
                 <div className="flex justify-center">
                    <Avatar className="w-24 h-24 border-4 border-primary">
                        <AvatarImage src={defaultUserProfileData.avatar} alt={name} />
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Alex Doe" />
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
            </div>

            <Separator />

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Your Courses</h3>
                    <p className="text-sm text-muted-foreground">Add the courses you are taking this semester.</p>
                </div>
                <div className="space-y-4">
                     {courses.map((course, index) => (
                        <div key={course.inputId} className="p-4 border rounded-lg space-y-4 relative bg-background/30">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`course-name-${course.inputId}`}>Course Name</Label>
                                    <Input id={`course-name-${course.inputId}`} value={course.name} onChange={e => handleCourseChange(course.inputId, 'name', e.target.value)} placeholder="e.g., Introduction to AI" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`instructor-${course.inputId}`}>Instructor Name</Label>
                                    <Input id={`instructor-${course.inputId}`} value={course.instructor} onChange={e => handleCourseChange(course.inputId, 'instructor', e.target.value)} placeholder="e.g., Prof. Ada Lovelace" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Schedule</Label>
                                {course.schedule.map((entry, scheduleIndex) => (
                                    <div key={scheduleIndex} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                        <Select value={entry.day} onValueChange={value => handleScheduleChange(course.inputId, scheduleIndex, 'day', value)}>
                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                            <SelectContent>{daysOfWeek.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <Input type="time" value={entry.startTime} onChange={e => handleScheduleChange(course.inputId, scheduleIndex, 'startTime', e.target.value)} />
                                        <span>-</span>
                                        <Input type="time" value={entry.endTime} onChange={e => handleScheduleChange(course.inputId, scheduleIndex, 'endTime', e.target.value)} />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeScheduleEntry(course.inputId, scheduleIndex)}>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => addScheduleEntry(course.inputId)}>
                                    <Plus className="mr-2 h-4 w-4"/> Add Time Slot
                                </Button>
                            </div>

                            {courses.length > 1 && (
                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeCourse(course.inputId)}>
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
