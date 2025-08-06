
'use client';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserData } from '@/hooks/use-user-data';
import { useState } from 'react';
import type { Task } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TasksPage() {
  const { courses, tasks, addTask, removeTask, updateTaskStatus } = useUserData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [type, setType] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('Medium');

  const sortedTasks = [...tasks].sort((a, b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime());

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'default';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Not Started': return 'outline';
      default: return 'default';
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId || !type || !deadline) {
        // Basic validation
        alert('Please fill all fields');
        return;
    }

    const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        courseId,
        type,
        deadline,
        priority,
        status: 'Not Started',
        assignedDate: new Date().toISOString().split('T')[0], // Set current date as assigned
    };
    
    addTask(newTask);

    // Reset form and close dialog
    setTitle('');
    setCourseId('');
    setType('');
    setDeadline('');
    setPriority('Medium');
    setIsDialogOpen(false);
  };


  return (
    <div>
      <PageHeader title="Task Management" action={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2" />New Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-sm">
            <form onSubmit={handleCreateTask}>
                <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Final Project Proposal" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="course" className="text-right">Course</Label>
                    <Select onValueChange={setCourseId} value={courseId} required>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                        {courses.map(course => <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>)}
                    </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Type</Label>
                    <Select onValueChange={setType} value={type} required>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Assignment">Assignment</SelectItem>
                        <SelectItem value="Performance Task">Performance Task</SelectItem>
                        <SelectItem value="Exam">Exam</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deadline" className="text-right">Deadline</Label>
                    <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="col-span-3" required/>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">Priority</Label>
                    <Select onValueChange={(v: Task['priority']) => setPriority(v)} value={priority}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Create Task</Button>
                </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      } />
      <Card className="bg-card/60 backdrop-blur-sm">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.length > 0 ? sortedTasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{courses.find(c => c.id === task.courseId)?.name}</TableCell>
                  <TableCell>{task.type}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell><Badge variant={getPriorityBadge(task.priority)}>{task.priority}</Badge></TableCell>
                  <TableCell><Badge variant={getStatusBadge(task.status)}>{task.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'Completed')}>Mark as Completed</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'In Progress')}>Mark as In Progress</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'Not Started')}>Mark as Not Started</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => removeTask(task.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                        No tasks added yet.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
