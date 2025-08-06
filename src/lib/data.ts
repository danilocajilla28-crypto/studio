import type { Course, Task, Schedule, File, Message, UserProfile } from '@/lib/types';

export const userProfileData: UserProfile = {
  name: 'Alex Doe',
  bio: 'Computer Science student at University of Innovation. Passionate about AI and building cool apps.',
  id: '2024-01234',
  avatar: 'https://placehold.co/100x100.png',
};

export const coursesData: Course[] = [
  { id: 'cs101', name: 'Introduction to Programming', color: 'bg-blue-600' },
  { id: 'ds202', name: 'Data Structures & Algorithms', color: 'bg-green-600' },
  { id: 'ai301', name: 'Artificial Intelligence', color: 'bg-purple-600' },
  { id: 'se404', name: 'Software Engineering', color: 'bg-red-600' },
  { id: 'scied3a', name: 'SCIED 3A', color: 'bg-yellow-500' },
];

export const tasksData: Task[] = [
  { id: 't1', courseId: 'cs101', title: 'Final Project Proposal', type: 'Assignment', assignedDate: '2024-05-20', deadline: '2024-06-10', priority: 'High', status: 'In Progress' },
  { id: 't2', courseId: 'ds202', title: 'Lab 5: Linked Lists', type: 'Performance Task', assignedDate: '2024-05-28', deadline: '2024-06-05', priority: 'High', status: 'Completed' },
  { id: 't3', courseId: 'ai301', title: 'Research Paper: Neural Networks', type: 'Assignment', assignedDate: '2024-05-15', deadline: '2024-06-20', priority: 'Medium', status: 'In Progress' },
  { id: 't4', courseId: 'se404', title: 'Group Presentation', type: 'Performance Task', assignedDate: '2024-06-01', deadline: '2024-06-15', priority: 'Low', status: 'Not Started' },
  { id: 't5', courseId: 'scied3a', title: 'Mid-term Exam', type: 'Exam', assignedDate: '2024-06-10', deadline: '2024-06-17', priority: 'High', status: 'Not Started' },
];

export const scheduleData: Schedule = {
  '8:00 AM - 9:30 AM': { Monday: { courseId: 'cs101', name: 'Intro to Prog' }, Tuesday: null, Wednesday: { courseId: 'cs101', name: 'Intro to Prog' }, Thursday: null, Friday: { courseId: 'ds202', name: 'Data Structures' } },
  '10:00 AM - 11:30 AM': { Monday: { courseId: 'ds202', name: 'Data Structures' }, Tuesday: { courseId: 'ai301', name: 'AI' }, Wednesday: null, Thursday: { courseId: 'ai301', name: 'AI' }, Friday: null },
  '1:00 PM - 2:30 PM': { Monday: null, Tuesday: { courseId: 'se404', name: 'Software Eng.' }, Wednesday: { courseId: 'scied3a', name: 'SCIED 3A' }, Thursday: { courseId: 'se404', name: 'Software Eng.' }, Friday: { courseId: 'scied3a', name: 'SCIED 3A' } },
  '3:00 PM - 4:30 PM': { Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null },
};

export const filesData: { [courseId: string]: File[] } = {
  cs101: [
    { id: 'f1', name: 'Syllabus.pdf', type: 'PDF', dateAdded: '2024-05-10', url: '#' },
    { id: 'f2', name: 'Lecture1.pptx', type: 'PPT', dateAdded: '2024-05-12', url: '#' },
  ],
  ds202: [
    { id: 'f3', name: 'LinkedLists.pdf', type: 'PDF', dateAdded: '2024-05-22', url: '#' },
  ],
  ai301: [
    { id: 'f4', name: 'NN_Basics.pdf', type: 'PDF', dateAdded: '2024-05-16', url: '#' },
    { id: 'f5', name: 'Search_Algorithms.docx', type: 'DOC', dateAdded: '2024-05-18', url: '#' },
  ],
  se404: [
    { id: 'f6', name: 'Agile_Methodology.pptx', type: 'PPT', dateAdded: '2024-05-25', url: '#' },
  ],
  scied3a: [
    { id: 'f7', name: 'Course_Outline.pdf', type: 'PDF', dateAdded: '2024-05-11', url: '#' },
  ],
};

export const messagesData: { [contact: string]: Message[] } = {
  'group-cs101': [
    { id: 'm1', sender: 'Prof. Turing', text: 'Welcome to CS101! Please review the syllabus.', timestamp: '10:00 AM', avatar: 'https://placehold.co/40x40.png' },
    { id: 'm2', sender: 'You', text: 'Thank you, professor!', timestamp: '10:05 AM', avatar: userProfileData.avatar },
  ],
  'group-ai301': [
    { id: 'm3', sender: 'Prof. Hinton', text: 'Reminder: Research paper outline is due next week.', timestamp: 'Yesterday', avatar: 'https://placehold.co/40x40.png' },
  ],
  'dm-jane': [
    { id: 'm4', sender: 'Jane Smith', text: 'Hey! Are you free to work on the SE project tomorrow?', timestamp: '5:30 PM', avatar: 'https://placehold.co/40x40.png' },
    { id: 'm5', sender: 'You', text: 'Yes, I am. Let\'s meet at the library at 2 PM.', timestamp: '5:45 PM', avatar: userProfileData.avatar },
  ],
};
