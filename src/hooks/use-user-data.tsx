
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile, Course, File as FileType, Task } from '@/lib/types';
import { userProfileData as defaultUserProfile, coursesData as defaultCourses, filesData as defaultFiles, tasksData as defaultTasks } from '@/lib/data';
// import { supabase } from '@/lib/supabase'; // Uncomment this after setting up your Supabase project

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

  // This useEffect would fetch initial data from Supabase
  useEffect(() => {
    setIsLoading(true);
    // This is an example of how you would fetch data.
    // You would need to have tables named 'profiles', 'courses', 'tasks', etc. in Supabase.
    /*
    const fetchData = async () => {
        // Assuming you have a user session.
        // const { data: { user } } = await supabase.auth.getUser();

        // if (user) {
        //     const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        //     const { data: coursesData } = await supabase.from('courses').select('*');
        //     const { data: tasksData } = await supabase.from('tasks').select('*');
        //     const { data: filesData } = await supabase.from('files').select('*');
            
        //     if (profileData) setUserProfileState(profileData);
        //     if (coursesData) setCoursesState(coursesData);
        //     if (tasksData) setTasksState(tasksData);
            
        //     // You would need to group files by courseId
        //     if (filesData) {
        //        const groupedFiles = filesData.reduce((acc, file) => {
        //            if (!acc[file.course_id]) {
        //                acc[file.course_id] = [];
        //            }
        //            acc[file.course_id].push(file);
        //            return acc;
        //        }, {});
        //        setFilesState(groupedFiles)
        //     }
        // }
        setIsLoading(false);
    }
    fetchData();
    */

    // For now, we continue using local data for the prototype
    setIsLoading(false);
  }, []);

  const setUserProfile = async (profile: UserProfile) => {
    setUserProfileState(profile);
    // Example Supabase call:
    // const { data, error } = await supabase.from('profiles').upsert(profile).select();
    // if (error) console.error("Error saving profile", error);
  };

  const setCourses = async (courses: Course[]) => {
    setCoursesState(courses);
     // Example Supabase call (you'd likely upsert one by one or handle it in a backend function)
    // for (const course of courses) {
    //     const { data, error } = await supabase.from('courses').upsert(course).select();
    //     if (error) console.error("Error saving course", error);
    // }
  };

  const addFile = async (courseId: string, file: FileType) => {
    // With Supabase, you would first upload the file to Supabase Storage,
    // get the URL, and then save the file metadata (including the URL) to your 'files' table.
    
    // Example:
    // const { data: uploadData, error: uploadError } = await supabase.storage
    //   .from('course-files') // your storage bucket name
    //   .upload(`${courseId}/${file.name}`, file.rawFileObject); // assuming you have the raw file
    
    // if (uploadError) {
    //   console.error('Upload error', uploadError);
    //   return;
    // }

    // const { data: urlData } = supabase.storage
    //   .from('course-files')
    //   .getPublicUrl(uploadData.path);
    
    // const newFileRecord = { ...file, url: urlData.publicUrl, course_id: courseId };
    // const { data, error } = await supabase.from('files').insert(newFileRecord).select();

    // After a successful insert, you'd update the local state
    setFilesState(prevFiles => {
        const newFiles = { ...prevFiles };
        if (!newFiles[courseId]) {
            newFiles[courseId] = [];
        }
        newFiles[courseId].unshift(file);
        return newFiles;
    });
  };

  const removeFile = async (courseId: string, fileId: string) => {
    // Example Supabase call:
    // const { error } = await supabase.from('files').delete().eq('id', fileId);
    // if (error) console.error("Error deleting file", error);

    setFilesState(prevFiles => {
        const newFiles = { ...prevFiles };
        if (newFiles[courseId]) {
            newFiles[courseId] = newFiles[courseId].filter(f => f.id !== fileId);
        }
        return newFiles;
    });
  };
  
  const addTask = async (task: Task) => {
      // Example Supabase call:
      // const { data, error } = await supabase.from('tasks').insert(task).select().single();
      // if (error) {
      //   console.error("Error adding task", error);
      //   return;
      // }
      // if (data) setTasksState(prev => [data, ...prev]);

      setTasksState(prev => [task, ...prev]);
  };

  const removeTask = async (taskId: string) => {
      // Example Supabase call:
      // const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      // if (error) console.error("Error deleting task", error);

      setTasksState(prev => prev.filter(t => t.id !== taskId));
  };

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
      // Example Supabase call:
      // const { data, error } = await supabase.from('tasks').update({ status }).eq('id', taskId).select().single();
      // if (error) console.error("Error updating task", error);

      setTasksState(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
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
