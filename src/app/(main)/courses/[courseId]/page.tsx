import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { coursesData, filesData } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Upload, Eye, Download, MoreHorizontal, FileText } from 'lucide-react';

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const course = coursesData.find(c => c.id === params.courseId);
  const files = filesData[params.courseId] || [];

  if (!course) {
    notFound();
  }

  return (
    <div>
      <PageHeader title={course.name} action={
        <Button><Upload className="mr-2" />Upload File</Button>
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
              {files.map(file => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    {file.name}
                  </TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.dateAdded}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
               {files.length === 0 && (
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
    </div>
  );
}
