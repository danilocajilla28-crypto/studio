import type { Course, Task, ScheduleData, File, Message, UserProfile } from '@/lib/types';

export const userProfileData: UserProfile = {
  name: '',
  bio: '',
  id: '',
  avatar: '',
};

export const coursesData: Course[] = [];

export const tasksData: Task[] = [];

// This mock data is less relevant now as schedule is tied to courses.
// Keeping it for potential use in dashboard preview, but will need adjustment.
export const scheduleData: ScheduleData = {};

export const filesData: { [courseId: string]: File[] } = {};

export const initialMessagesData: { [contact: string]: Message[] } = {};
