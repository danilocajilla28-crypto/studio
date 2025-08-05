export interface UserProfile {
  name: string;
  bio: string;
  id: string;
  avatar: string;
}

export interface Course {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  courseId: string;
  title: string;
  type: 'Performance Task' | 'Assignment' | 'Exam' | string;
  assignedDate: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Completed' | 'In Progress' | 'Not Started';
}

export type Schedule = {
  [time: string]: {
    [day: string]: {
      courseId: string;
      name: string;
    } | null;
  };
};

export interface File {
  id: string;
  name: string;
  type: 'PDF' | 'PPT' | 'DOC' | 'Image' | 'Video' | string;
  dateAdded: string;
  url: string;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  avatar: string;
}
