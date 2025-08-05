'use client';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListTodo, Calendar, FileText, ArrowRight } from 'lucide-react';
import { tasksData, coursesData, scheduleData, filesData } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function DashboardPage() {
  const upcomingTasks = tasksData.filter(t => t.status !== 'Completed').slice(0, 3);
  const recentFiles = Object.values(filesData).flat().slice(0, 3);
  const scheduleTimeSlots = Object.keys(scheduleData).slice(0, 2);

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="space-y-6">
        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline">Welcome back, Alex!</CardTitle>
            <CardDescription>Here's a quick overview of your academic life.</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2 bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTodo className="w-6 h-6 text-accent" />
                <CardTitle>Upcoming Deadlines</CardTitle>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/tasks">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {upcomingTasks.map(task => (
                  <li key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div>
                      <p className="font-semibold">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{coursesData.find(c => c.id === task.courseId)?.name}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm">{task.deadline}</p>
                       <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'} className="mt-1">{task.priority}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-accent" />
                <CardTitle>Recent Files</CardTitle>
              </div>
               <Button variant="ghost" size="sm" asChild>
                <Link href="/courses">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentFiles.map(file => (
                   <li key={file.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                     <FileText className="w-5 h-5 text-muted-foreground" />
                     <div>
                       <p className="font-semibold truncate">{file.name}</p>
                       <p className="text-sm text-muted-foreground">{file.dateAdded}</p>
                     </div>
                   </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-accent" />
                    <CardTitle>Schedule Preview</CardTitle>
                </div>
                 <Button variant="ghost" size="sm" asChild>
                    <Link href="/schedule">
                        Full Schedule <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Time</TableHead>
                            <TableHead>Monday</TableHead>
                            <TableHead>Tuesday</TableHead>
                            <TableHead>Wednesday</TableHead>
                            <TableHead>Thursday</TableHead>
                            <TableHead>Friday</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scheduleTimeSlots.map((time) => (
                            <TableRow key={time}>
                                <TableCell className="font-medium">{time}</TableCell>
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                                    <TableCell key={day}>
                                        {scheduleData[time][day] ? (
                                        <div className={cn("p-2 rounded-md text-center text-sm", coursesData.find(c => c.id === scheduleData[time][day]!.courseId)?.color)}>
                                            <p className="font-semibold text-foreground">{scheduleData[time][day]!.name}</p>
                                        </div>
                                        ) : null}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
