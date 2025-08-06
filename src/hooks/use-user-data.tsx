
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile, Course, File as FileType, Task } from '@/lib/types';
import { userProfileData as defaultUserProfile, coursesData as defaultCourses, filesData as defaultFiles, tasksData as defaultTasks } from '@/lib/data';

interface UserDataContextType {
  userProfile: UserProfile;
  courses: Course[];
  files: { [courseId: string]: FileType[] };
  tasks: Task[];
  setUserProfile: (profile: UserProfile) => void;
  setCourses: (courses: Course[]) => void;
  addFile: (courseId: string, file: FileType) => void;
  removeFile: (courseId: string, fileId: string) => void;
  addTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  isLoading: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile>(defaultUserProfile);
  const [courses, setCoursesState] = useState<Course[]>(defaultCourses);
  const [files, setFilesState] = useState<{ [courseId: string]: FileType[] }>(defaultFiles);
  const [tasks, setTasksState] = useState<Task[]>(defaultTasks);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('userProfile');
      const storedCourses = localStorage.getItem('courses');
      const storedTasks = localStorage.getItem('tasks');

      if (storedProfile) {
        setUserProfileState(JSON.parse(storedProfile));
      }
      if (storedCourses) {
        setCoursesState(JSON.parse(storedCourses));
      }
      if (storedTasks) {
        setTasksState(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      // Reset to defaults if parsing fails
      setUserProfileState(defaultUserProfile);
      setCoursesState(defaultCourses);
      setTasksState(defaultTasks);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
    try {
      localStorage.setItem('userProfile', JSON.stringify(profile));
    } catch (error) {
      console.error("Failed to save user profile to localStorage", error);
    }
  };

  const setCourses = (courses: Course[]) => {
    setCoursesState(courses);
    try {
      localStorage.setItem('courses', JSON.stringify(courses));
    } catch (error) {
      console.error("Failed to save courses to localStorage", error);
    }
  };

  const addFile = (courseId: string, file: FileType) => {
    setFilesState(prevFiles => {
        const newFiles = { ...prevFiles };
        if (!newFiles[courseId]) {
            newFiles[courseId] = [];
        }
        newFiles[courseId].unshift(file);
        return newFiles;
    });
  };

  const removeFile = (courseId: string, fileId: string) => {
    setFilesState(prevFiles => {
        const newFiles = { ...prevFiles };
        if (newFiles[courseId]) {
            newFiles[courseId] = newFiles[courseId].filter(f => f.id !== fileId);
        }
        return newFiles;
    });
  };
  
  const addTask = (task: Task) => {
      const newTasks = [task, ...tasks];
      setTasksState(newTasks);
      try {
          localStorage.setItem('tasks', JSON.stringify(newTasks));
      } catch (error) {
          console.error("Failed to save tasks to localStorage", error);
      }
  };

  const removeTask = (taskId: string) => {
      const newTasks = tasks.filter(t => t.id !== taskId);
      setTasksState(newTasks);
      try {
          localStorage.setItem('tasks', JSON.stringify(newTasks));
      } catch (error) {
          console.error("Failed to save tasks to localStorage", error);
      }
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
      const newTasks = tasks.map(t => t.id === taskId ? { ...t, status } : t);
      setTasksState(newTasks);
      try {
          localStorage.setItem('tasks', JSON.stringify(newTasks));
      } catch (error) {
          console.error("Failed to save tasks to localStorage", error);
      }
  }


  const value = {
    userProfile,
    courses,
    files,
    tasks,
    setUserProfile,
    setCourses,
    addFile,
    removeFile,
    addTask,
    removeTask,
    updateTaskStatus,
    isLoading,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
