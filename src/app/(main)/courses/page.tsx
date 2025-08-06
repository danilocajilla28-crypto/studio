
'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUserData } from '@/hooks/use-user-data';
import { cn } from '@/lib/utils';
import { FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CoursesPage() {
  const { courses } = useUserData();

  return (
    <div>
      <PageHeader title="Courses" />
       {courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map(course => (
            <Link href={`/courses/${course.id}`} key={course.id} className="block">
                <Card className="bg-card/60 backdrop-blur-sm hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={cn("p-3 rounded-lg", course.color)}>
                        <FolderKanban className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <CardTitle className="font-headline">{course.name}</CardTitle>
                        <CardDescription>View files and details</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="bg-card/60 backdrop-blur-sm text-center p-8">
            <CardTitle>No Courses Found</CardTitle>
            <CardDescription>You haven't added any courses yet. Go to your profile to add them.</CardDescription>
            <Button asChild className="mt-4">
                <Link href="/welcome">Add Courses</Link>
            </Button>
        </Card>
      )}
    </div>
  );
}
