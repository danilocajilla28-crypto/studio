
'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { notFound } from 'next/navigation';
import { Upload, Eye, Download, MoreHorizontal, FileText, Trash2 } from 'lucide-react';
import { useUserData } from '@/hooks/use-user-data';
import type { File as FileType } from '@/lib/types';
import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const { courses, files, addFile, removeFile } = useUserData();
  const course = courses.find(c => c.id === params.courseId);
  const courseFiles = files[params.courseId] || [];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [viewingFile, setViewingFile] = useState<FileType | null>(null);

  if (!course) {
    return (
       <div>
         <PageHeader title="Loading..." />
         <Card className="bg-card/60 backdrop-blur-sm">
           <CardHeader>
             <CardTitle>Loading course details...</CardTitle>
           </CardHeader>
         </Card>
       </div>
    );
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData: FileType = {
        id: `${params.courseId}-${Date.now()}`,
        name: file.name,
        type: file.type,
        dateAdded: new Date().toLocaleDateString(),
        url: e.target?.result as string,
      };
      addFile(params.courseId, fileData);
    };
    reader.readAsDataURL(file);
  };

  const openFile = (file: FileType) => {
    setViewingFile(file);
  }

  const downloadFile = (file: FileType) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <PageHeader title={course.name} action={
        <>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2" />Upload File
          </Button>
        </>
      } />
      <Card className="bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>File Repository</CardTitle>
          <CardDescription>All materials for {course.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseFiles.map(file => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    {file.name}
                  </TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.dateAdded}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openFile(file)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => downloadFile(file)}><Download className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(params.courseId, file.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
               {courseFiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                    No files uploaded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {viewingFile && (
        <Dialog open={!!viewingFile} onOpenChange={(isOpen) => !isOpen && setViewingFile(null)}>
          <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-background/80 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle>{viewingFile.name}</DialogTitle>
              <DialogDescription>{viewingFile.type} - {viewingFile.dateAdded}</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto rounded-md border">
              {viewingFile.type.startsWith('image/') ? (
                <div className="relative w-full h-full">
                   <Image src={viewingFile.url} alt={viewingFile.name} layout="fill" objectFit="contain" />
                </div>
              ) : viewingFile.type === 'application/pdf' ? (
                <iframe src={viewingFile.url} className="w-full h-full" title={viewingFile.name} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <FileText className="w-24 h-24 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold">Preview not available</h3>
                  <p className="text-muted-foreground">This file type cannot be previewed directly in the browser.</p>
                  <Button onClick={() => downloadFile(viewingFile)} className="mt-6">
                    <Download className="mr-2" /> Download File
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
