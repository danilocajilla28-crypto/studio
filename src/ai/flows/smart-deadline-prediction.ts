'use server';

/**
 * @fileOverview Predicts upcoming task deadlines and sends personalized reminders.
 *
 * - predictDeadline - A function that predicts task deadlines and generates reminders.
 * - PredictDeadlineInput - The input type for the predictDeadline function.
 * - PredictDeadlineOutput - The return type for the predictDeadline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const PredictDeadlineInputSchema = z.object({
  courseSchedule: z
    .string()
    .describe("The student's course schedule, including course names and meeting times."),
  taskList: z.string().describe('A list of tasks, including titles, types, and assigned dates.'),
  userBehavior: z
    .string()
    .describe(
      'A summary of the user behavior, including task completion history and preferred study times.'
    ),
});
export type PredictDeadlineInput = z.infer<typeof PredictDeadlineInputSchema>;

const PredictDeadlineOutputSchema = z.object({
  predictedDeadlines: z
    .string()
    .describe('A list of predicted deadlines for upcoming tasks, with reasons for the predictions.'),
  personalizedReminders: z
    .string()
    .describe('Personalized reminders for upcoming deadlines, tailored to the user behavior.'),
});
export type PredictDeadlineOutput = z.infer<typeof PredictDeadlineOutputSchema>;

export async function predictDeadline(input: PredictDeadlineInput): Promise<PredictDeadlineOutput> {
  return predictDeadlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictDeadlinePrompt',
  input: {schema: PredictDeadlineInputSchema},
  output: {schema: PredictDeadlineOutputSchema},
  prompt: `You are an AI assistant designed to help students manage their time effectively.

  Based on the student's course schedule, task list, and user behavior, predict the upcoming task deadlines and generate personalized reminders.

  Course Schedule: {{{courseSchedule}}}
  Task List: {{{taskList}}}
  User Behavior: {{{userBehavior}}}

  Consider the following when predicting deadlines:
  - Course schedule and meeting times
  - Task types and assigned dates
  - User's task completion history
  - User's preferred study times

  Provide a list of predicted deadlines for upcoming tasks, with reasons for the predictions.
  Generate personalized reminders for upcoming deadlines, tailored to the user's behavior.
  `,
  model: 'googleai/gemini-2.0-flash'
});

const predictDeadlineFlow = ai.defineFlow(
  {
    name: 'predictDeadlineFlow',
    inputSchema: PredictDeadlineInputSchema,
    outputSchema: PredictDeadlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
