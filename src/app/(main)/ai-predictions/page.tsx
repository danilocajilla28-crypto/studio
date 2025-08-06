
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { predictDeadline, PredictDeadlineOutput } from '@/ai/flows/smart-deadline-prediction';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUserData } from '@/hooks/use-user-data';

const formSchema = z.object({
  courseSchedule: z.string().min(1, { message: 'Please provide your schedule.' }),
  taskList: z.string().min(1, { message: 'Please provide your tasks.' }),
  userBehavior: z.string().min(1, { message: 'Please provide your habits.' }),
});

export default function AiPredictionsPage() {
  const [prediction, setPrediction] = useState<PredictDeadlineOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { courses, tasks, userProfile, isLoading: isUserDataLoading } = useUserData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseSchedule: '',
      taskList: '',
      userBehavior: '',
    },
  });

  useEffect(() => {
    if (!isUserDataLoading) {
      // Format course schedule
      const scheduleString = courses.map(course => 
        `${course.name}: ${course.schedule.map(s => `${s.day} ${s.startTime}-${s.endTime}`).join(', ')}`
      ).join('\n');

      // Format task list
      const taskString = tasks.map(task => {
        const courseName = courses.find(c => c.id === task.courseId)?.name || 'Unknown Course';
        return `${task.title} (${task.type}) for ${courseName}, Assigned: ${task.assignedDate}, Deadline: ${task.deadline}, Priority: ${task.priority}, Status: ${task.status}`;
      }).join('\n');
      
      const behaviorString = userProfile.bio || 'Not specified.';

      form.reset({
        courseSchedule: scheduleString || 'No courses added yet. Please add courses in your profile.',
        taskList: taskString || 'No tasks added yet. Please add tasks in the tasks page.',
        userBehavior: behaviorString,
      });
    }
  }, [isUserDataLoading, courses, tasks, userProfile, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await predictDeadline(values);
      setPrediction(result);
    } catch (e) {
      setError('An error occurred while generating predictions. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="AI Deadline Predictions" />
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Analyze Your Workload</CardTitle>
            <CardDescription>
              Your current schedule, tasks, and habits are loaded below. Our AI will predict deadlines and create personalized reminders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="courseSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Schedule</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your class schedule..." {...field} rows={4} disabled={isUserDataLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taskList"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Task List</FormLabel>
                      <FormControl>
                        <Textarea placeholder="List your current assignments, projects, etc." {...field} rows={4} disabled={isUserDataLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userBehavior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Habits & Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your study habits, e.g., when you prefer to work." {...field} rows={4} disabled={isUserDataLoading}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || isUserDataLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                     <Sparkles className="mr-2 h-4 w-4" />
                      Generate Predictions
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Predicted Deadlines</CardTitle>
              <CardDescription>AI-generated estimates for your tasks.</CardDescription>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap font-mono text-sm min-h-[150px] bg-background/50 rounded-md p-4">
              {isLoading ? 'Generating...' : prediction?.predictedDeadlines || 'Predictions will appear here.'}
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Personalized Reminders</CardTitle>
              <CardDescription>Tailored suggestions to keep you on track.</CardDescription>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap font-mono text-sm min-h-[150px] bg-background/50 rounded-md p-4">
               {isLoading ? 'Generating...' : prediction?.personalizedReminders || 'Reminders will appear here.'}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
