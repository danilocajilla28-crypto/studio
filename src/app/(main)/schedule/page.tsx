import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { scheduleData, coursesData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = Object.keys(scheduleData);

export default function SchedulePage() {
  return (
    <div>
      <PageHeader title="Weekly Schedule" action={<Button><Plus className="mr-2" />Add Class</Button>} />
      <Card className="bg-card/60 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] font-headline text-lg">Time</TableHead>
                {days.map(day => (
                  <TableHead key={day} className="text-center font-headline text-lg">{day}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSlots.map(time => (
                <TableRow key={time}>
                  <TableCell className="font-medium text-muted-foreground">{time}</TableCell>
                  {days.map(day => {
                    const event = scheduleData[time][day];
                    const course = event ? coursesData.find(c => c.id === event.courseId) : null;
                    return (
                      <TableCell key={day} className="p-1">
                        {event && course ? (
                          <div className={cn("flex flex-col items-center justify-center h-24 rounded-lg p-2 text-center", course.color)}>
                            <p className="font-bold text-foreground">{event.name}</p>
                            <p className="text-sm text-foreground/80">{course.name}</p>
                          </div>
                        ) : (
                           <div className="h-24 rounded-lg bg-background/20"></div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
