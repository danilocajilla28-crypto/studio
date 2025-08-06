'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile, Course } from '@/lib/types';
import { userProfileData as defaultUserProfile, coursesData as defaultCourses } from '@/lib/data';

interface UserDataContextType {
  userProfile: UserProfile;
  courses: Course[];
  setUserProfile: (profile: UserProfile) => void;
  setCourses: (courses: Course[]) => void;
  isLoading: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile>(defaultUserProfile);
  const [courses, setCoursesState] = useState<Course[]>(defaultCourses);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('userProfile');
      const storedCourses = localStorage.getItem('courses');

      if (storedProfile) {
        setUserProfileState(JSON.parse(storedProfile));
      }
      if (storedCourses) {
        setCoursesState(JSON.parse(storedCourses));
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      // Use default data if parsing fails
      setUserProfileState(defaultUserProfile);
      setCoursesState(defaultCourses);
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

  const value = {
    userProfile,
    courses,
    setUserProfile,
    setCourses,
    isLoading,
  };

  return (
    <UserDataContext.Provider value={value}>
      {!isLoading && children}
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
