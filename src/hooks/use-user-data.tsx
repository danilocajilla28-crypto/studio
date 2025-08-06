
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile, Course, File as FileType, Task } from '@/lib/types';
import { supabase } from '@/lib/supabase'; 

interface UserDataContextType {
  userProfile: UserProfile;
  courses: Course[];
  files: { [courseId: string]: FileType[] };
  tasks: Task[];
  setUserProfile: (profile: UserProfile) => void;
  setCourses: (courses: Course[]) => void;
  addFile: (courseId: string, file: FileType, rawFile?: File) => void;
  removeFile: (courseId: string, fileId: string) => void;
  addTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  isLoading: boolean;
}

const defaultUserProfile: UserProfile = { name: '', bio: '', id: '', avatar: '' };

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile>(defaultUserProfile);
  const [courses, setCoursesState] = useState<Course[]>([]);
  const [files, setFilesState] = useState<{ [courseId: string]: FileType[] }>({});
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            const { data: coursesData } = await supabase.from('courses').select('*');
            const { data: tasksData } = await supabase.from('tasks').select('*');
            const { data: filesData } = await supabase.from('files').select('*');
            
            if (profileData) setUserProfileState(profileData);
            if (coursesData) setCoursesState(coursesData);
            if (tasksData) setTasksState(tasksData);
            
            if (filesData) {
               const groupedFiles = filesData.reduce((acc, file) => {
                   const courseId = file.course_id;
                   if (!acc[courseId]) {
                       acc[courseId] = [];
                   }
                   acc[courseId].push(file);
                   return acc;
               }, {} as {[courseId: string]: FileType[]});
               setFilesState(groupedFiles)
            }
        }
        setIsLoading(false);
    }
    fetchData();
  }, []);

  const setUserProfile = async (profile: UserProfile) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const profileWithId = { ...profile, id: user.id };
    setUserProfileState(profileWithId);
    const { error } = await supabase.from('profiles').upsert(profileWithId);
    if (error) console.error("Error saving profile", error);
  };

  const setCourses = async (courses: Course[]) => {
    setCoursesState(courses);
    for (const course of courses) {
        const { error } = await supabase.from('courses').upsert(course);
        if (error) console.error("Error saving course", error);
    }
  };

  const addFile = async (courseId: string, file: FileType, rawFile?: File) => {
    let fileUrl = file.url;
    if (rawFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('course-files')
          .upload(`${courseId}/${rawFile.name}-${Date.now()}`, rawFile);
        
        if (uploadError) {
          console.error('Upload error', uploadError);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('course-files')
          .getPublicUrl(uploadData.path);
        
        fileUrl = urlData.publicUrl;
    }
    
    const newFileRecord = { ...file, url: fileUrl, course_id: courseId };
    const { data: dbFile, error } = await supabase.from('files').insert(newFileRecord).select().single();

    if(error) {
        console.error("Error saving file record", error);
        return;
    }
    
    if (dbFile) {
        setFilesState(prevFiles => {
            const newFiles = { ...prevFiles };
            if (!newFiles[courseId]) {
                newFiles[courseId] = [];
            }
            newFiles[courseId].unshift(dbFile);
            return newFiles;
        });
    }
  };

  const removeFile = async (courseId: string, fileId: string) => {
    const { error } = await supabase.from('files').delete().eq('id', fileId);
    if (error) {
        console.error("Error deleting file", error);
        return;
    }
    setFilesState(prevFiles => {
        const newFiles = { ...prevFiles };
        if (newFiles[courseId]) {
            newFiles[courseId] = newFiles[courseId].filter(f => f.id !== fileId);
        }
        return newFiles;
    });
  };
  
  const addTask = async (task: Task) => {
      const { data, error } = await supabase.from('tasks').insert(task).select().single();
      if (error) {
        console.error("Error adding task", error);
        return;
      }
      if (data) setTasksState(prev => [data, ...prev]);
  };

  const removeTask = async (taskId: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) {
        console.error("Error deleting task", error);
        return;
      }
      setTasksState(prev => prev.filter(t => t.id !== taskId));
  };

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
      const { data, error } = await supabase.from('tasks').update({ status }).eq('id', taskId).select().single();
      if (error) {
        console.error("Error updating task", error);
        return;
      }
      if (data) {
        setTasksState(prev => prev.map(t => t.id === taskId ? data : t));
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
