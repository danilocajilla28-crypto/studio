-- Supabase Schema for CourseCompass

-- 1. PROFILES TABLE
-- Stores user profile information.
CREATE TABLE profiles (
  id uuid NOT NULL PRIMARY KEY,
  name text,
  bio text,
  avatar text
);

-- 2. COURSES TABLE
-- Stores course information for each user.
CREATE TABLE courses (
  id text NOT NULL PRIMARY KEY,
  name text NOT NULL,
  instructor text,
  schedule jsonb DEFAULT '[]'::jsonb,
  color varchar
);

-- 3. TASKS TABLE
-- Stores the to-do list and tasks for each course.
CREATE TABLE tasks (
    id text NOT NULL PRIMARY KEY,
    "courseId" text NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    "assignedDate" date NOT NULL,
    deadline date NOT NULL,
    priority text NOT NULL DEFAULT 'Medium',
    status text NOT NULL DEFAULT 'Not Started'
);

-- 4. FILES TABLE
-- Stores references to uploaded documents and links.
CREATE TABLE files (
    id text NOT NULL PRIMARY KEY,
    course_id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    "dateAdded" text NOT NULL,
    url text NOT NULL,
    CONSTRAINT files_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 5. STORAGE BUCKET SETUP
-- This part must be done through the Supabase UI, but the policy SQL is here for reference.
-- Bucket name: course-files
--
-- After creating the bucket, go to "Storage" > "Policies" and create a new policy
-- for the 'course-files' bucket with the following details to make it public.

-- For viewing files (public access):
-- Policy name: Public Select
-- Allowed operations: SELECT
-- Target roles: anon, authenticated
-- Policy definition (using SQL):
-- CREATE POLICY "Public Select" ON storage.objects
-- FOR SELECT
-- USING (bucket_id = 'course-files');

-- For uploading files (restricts uploads to authenticated users):
-- Policy name: Authenticated Upload
-- Allowed operations: INSERT
-- Target roles: authenticated
-- Policy definition (using SQL):
-- CREATE POLICY "Authenticated Upload" ON storage.objects
-- FOR INSERT
-- WITH CHECK (bucket_id = 'course-files' AND auth.role() = 'authenticated');
