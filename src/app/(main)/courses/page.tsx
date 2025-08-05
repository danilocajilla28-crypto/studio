import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { coursesData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { FolderKanban } from 'lucide-react';

export default function CoursesPage() {
  return (
    <div>
      <PageHeader title="Courses" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {coursesData.map(course => (
          <Link href={`/courses/${course.id}`} key={course.id} legacyBehavior>
            <a className="block">
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
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
