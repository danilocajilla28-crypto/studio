import type { Course, Task, ScheduleData, File, Message, UserProfile } from '@/lib/types';

export const userProfileData: UserProfile = {
  name: '',
  bio: '',
  id: '',
  avatar: 'https://placehold.co/100x100.png',
};

export const coursesData: Course[] = [];

export const tasksData: Task[] = [];

// This mock data is less relevant now as schedule is tied to courses.
// Keeping it for potential use in dashboard preview, but will need adjustment.
export const scheduleData: ScheduleData = {
  '8:00 AM - 9:30 AM': { Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null },
  '10:00 AM - 11:30 AM': { Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null },
  '1:00 PM - 2:30 PM': { Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null },
  '3:00 PM - 4:30 PM': { Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null },
};


export const filesData: { [courseId: string]: File[] } = {};

export const messagesData: { [contact: string]: Message[] } = {};

    