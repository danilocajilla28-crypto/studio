
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile, Course, File as FileType } from '@/lib/types';
import { userProfileData as defaultUserProfile, coursesData as defaultCourses, filesData as defaultFiles } from '@/lib/data';

interface UserDataContextType {
  userProfile: UserProfile;
  courses: Course[];
  files: { [courseId: string]: FileType[] };
  setUserProfile: (profile: UserProfile) => void;
  setCourses: (courses: Course[]) => void;
  addFile: (courseId: string, file: FileType) => void;
  removeFile: (courseId: string, fileId: string) => void;
  isLoading: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile>(defaultUserProfile);
  const [courses, setCoursesState] = useState<Course[]>(defaultCourses);
  const [files, setFilesState] = useState<{ [courseId: string]: FileType[] }>(defaultFiles);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('userProfile');
      const storedCourses = localStorage.getItem('courses');
      const storedFiles = localStorage.getItem('files');

      if (storedProfile) {
        setUserProfileState(JSON.parse(storedProfile));
      }
      if (storedCourses) {
        setCoursesState(JSON.parse(storedCourses));
      }
      if (storedFiles) {
        setFilesState(JSON.parse(storedFiles));
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      setUserProfileState(defaultUserProfile);
      setCoursesState(defaultCourses);
      setFilesState(defaultFiles);
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
    const newFiles = { ...files };
    if (!newFiles[courseId]) {
      newFiles[courseId] = [];
    }
    newFiles[courseId].push(file);
    setFilesState(newFiles);
    try {
      localStorage.setItem('files', JSON.stringify(newFiles));
    } catch (error) {
      console.error("Failed to save files to localStorage", error);
    }
  };

  const removeFile = (courseId: string, fileId: string) => {
    const newFiles = { ...files };
    if (newFiles[courseId]) {
      newFiles[courseId] = newFiles[courseId].filter(f => f.id !== fileId);
      setFilesState(newFiles);
      try {
        localStorage.setItem('files', JSON.stringify(newFiles));
      } catch (error) {
        console.error("Failed to save files to localStorage", error);
      }
    }
  };

  const value = {
    userProfile,
    courses,
    files,
    setUserProfile,
    setCourses,
    addFile,
    removeFile,
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
