
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';
import { useUserData } from '@/hooks/use-user-data';
import type { Course, ScheduleEntry } from '@/lib/types';
import Link from 'next/link';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = Array.from({ length: 28 }, (_, i) => {
    const hour = Math.floor(i / 2) + 7;
    const minute = i % 2 === 0 ? '00' : '30';
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute} ${period}`;
});

// Helper to convert time string (HH:mm) to minutes from midnight
const timeToMinutes = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};


// Helper to convert time string (e.g., 8:00 AM) to minutes from midnight
const displayTimeToMinutes = (time: string) => {
    const [hourMinute, period] = time.split(' ');
    let [hour, minute] = hourMinute.split(':').map(Number);
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    }
    if (period === 'AM' && hour === 12) {
      hour = 0; // Midnight case
    }
    return hour * 60 + minute;
};

export default function SchedulePage() {
  const { courses, isLoading } = useUserData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const flattenedSchedule = courses.flatMap(course => 
    course.schedule.map(entry => {
        const startTime = timeToMinutes(entry.startTime);
        const endTime = timeToMinutes(entry.endTime);
        // Start row is based on 30-min intervals starting from 7:00 AM
        const startRow = Math.floor((startTime - timeToMinutes('07:00')) / 30) + 2;
        const durationMinutes = endTime - startTime;
        const rowSpan = Math.round(durationMinutes / 30);

        const dayIndex = days.indexOf(entry.day);
        if (dayIndex === -1) return null;

        return {
            course,
            entry,
            startRow,
            rowSpan,
            dayIndex,
            timeRange: `${entry.startTime} - ${entry.endTime}`
        }
    }).filter(Boolean)
  );

  return (
    <div>
      <PageHeader title="Weekly Schedule" action={
          <Button asChild>
            <Link href="/welcome"><Plus className="mr-2" />Add/Edit Courses</Link>
          </Button>} 
      />
      {courses.length === 0 ? (
        <Card className="bg-card/60 backdrop-blur-sm text-center p-8">
            <CardTitle>No Schedule Found</CardTitle>
            <CardDescription>You haven't added any courses or schedules yet.</CardDescription>
            <Button asChild className="mt-4">
                <Link href="/welcome">Add Courses</Link>
            </Button>
        </Card>
      ) : (
      <Card className="bg-card/60 backdrop-blur-sm p-4 overflow-x-auto">
        <div className="grid grid-rows-[auto_repeat(28,30px)] gap-x-2 gap-y-0 text-sm" style={{gridTemplateColumns: 'auto repeat(7, minmax(100px, 1fr))'}}>
          {/* Empty cell for top-left corner */}
          <div></div>
          {/* Day Headers */}
          {days.map(day => (
            <div key={day} className="text-center font-headline text-lg py-2 sticky top-0 bg-card/80 backdrop-blur-sm z-10">
              {day}
            </div>
          ))}

          {/* Time Slots & Grid Lines */}
          {timeSlots.map((time, index) => (
            <React.Fragment key={time}>
              <div className="row-start-auto col-start-1 text-right pr-2 text-muted-foreground text-xs" style={{ gridRow: index + 2 }}>
                {time}
              </div>
              {/* Grid lines */}
              {days.map((day, dayIdx) => (
                  <div key={`${day}-${time}-line`} className="border-b border-dashed border-border" style={{ gridColumn: dayIdx + 2, gridRow: index + 2 }}></div>
              ))}
            </React.Fragment>
          ))}
          
           {/* Schedule Events */}
           {flattenedSchedule.map((event, index) => (
              event && (
                 <div
                  key={`${event.course.id}-${event.entry.day}-${index}`}
                  className={cn("p-2 rounded-lg flex flex-col justify-center items-center text-center text-white overflow-hidden", event.course.color)}
                  style={{
                    gridColumnStart: event.dayIndex + 2,
                    gridRowStart: event.startRow,
                    gridRowEnd: `span ${event.rowSpan}`,
                  }}
                >
                  <p className="font-bold text-sm">{event.course.name}</p>
                  <p className="text-xs">{event.course.instructor}</p>
                   <p className="text-xs opacity-80 mt-1">{event.timeRange.replace(/AM|PM/g, '').replace(/\s/g, '')}</p>
                </div>
              )
           ))}
        </div>
      </Card>
      )}
    </div>
  );
}
