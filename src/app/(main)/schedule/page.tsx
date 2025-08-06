'use client';

import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { scheduleData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';
import { useUserData } from '@/hooks/use-user-data';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

// Helper to convert time string to a number for calculation
const timeToMinutes = (time: string) => {
  const [hourMinute, period] = time.split(' ');
  let [hour] = hourMinute.split(':').map(Number);
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  }
  if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  return hour * 60;
};

export default function SchedulePage() {
  const { courses } = useUserData();

  // In a real app, this schedule data would also come from the user input.
  // For now, we continue using the mock scheduleData and map courses to it.
  const flattenedSchedule = Object.entries(scheduleData).flatMap(([timeRange, dailySchedule]) => {
    const [startTimeStr, endTimeStr] = timeRange.split(' - ');
    const startTime = timeToMinutes(startTimeStr);
    const endTime = timeToMinutes(endTimeStr);
    const startRow = Math.floor((startTime - timeToMinutes(timeSlots[0])) / 60) + 2;
    const durationHours = (endTime - startTime) / 60;
    const rowSpan = Math.round(durationHours * 2) / 2; // Supports half-hour increments

    return Object.entries(dailySchedule).map(([day, event]) => {
      if (!event) return null;
      const dayIndex = days.indexOf(day);
      if (dayIndex === -1) return null;
      
      const course = courses.find(c => c.id === event.courseId);

      return {
        ...event,
        day,
        dayIndex,
        startTime,
        rowSpan,
        startRow,
        course,
        timeRange,
      };
    }).filter(Boolean);
  });

  return (
    <div>
      <PageHeader title="Weekly Schedule" action={<Button><Plus className="mr-2" />Add Class</Button>} />
      <Card className="bg-card/60 backdrop-blur-sm p-4">
        <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] grid-rows-[auto_repeat(22,30px)] gap-x-2 gap-y-0 text-sm">
          {/* Empty cell for top-left corner */}
          <div></div>
          {/* Day Headers */}
          {days.map(day => (
            <div key={day} className="text-center font-headline text-lg py-2 sticky top-0 bg-card/80 backdrop-blur-sm">
              {day}
            </div>
          ))}

          {/* Time Slots */}
          {timeSlots.map((time, index) => (
            <React.Fragment key={time}>
              <div className="row-start-auto col-start-1 text-right pr-2 text-muted-foreground" style={{ gridRow: `${index * 2 + 2} / span 2` }}>
                {time}
              </div>
              {/* Grid lines */}
              {days.map((day, dayIdx) => (
                  <div key={`${day}-${time}-line`} className="border-b border-dashed border-border" style={{ gridColumn: dayIdx + 2, gridRow: index * 2 + 2 }}></div>
              ))}
            </React.Fragment>
          ))}
          
           {/* Schedule Events */}
           {flattenedSchedule.map(event => (
              event && event.course && (
                 <div
                  key={`${event.courseId}-${event.day}`}
                  className={cn("p-2 rounded-lg flex flex-col justify-center items-center text-center text-white", event.course.color)}
                  style={{
                    gridColumnStart: event.dayIndex + 2,
                    gridRowStart: event.startRow,
                    gridRowEnd: `span ${event.rowSpan * 2}`,
                  }}
                >
                  <p className="font-bold">{event.name}</p>
                  <p className="text-xs">{event.course.name}</p>
                  <p className="text-xs opacity-80 mt-1">{event.timeRange}</p>
                </div>
              )
           ))}
        </div>
      </Card>
    </div>
  );
}
