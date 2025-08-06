
'use client';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Camera, FileText, Video, VideoOff, RefreshCw, Upload, Download, Save, Layers, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserData } from '@/hooks/use-user-data';
import type { File as FileType } from '@/lib/types';
import jsPDF from 'jspdf';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';


export default function ScannerPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { courses, addFile, files } = useUserData();

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  
  const recentFiles = Object.values(files).flat().filter(f => f.type.startsWith('image/') || f.type === 'application/pdf').slice(0, 3);


  useEffect(() => {
    return () => {
      // Stop camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getCameraPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
       toast({
          variant: 'destructive',
          title: 'Unsupported Browser',
          description: 'Your browser does not support camera access.',
        });
        setHasCameraPermission(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
      setIsCameraOn(false);
    }
  };

  const handleStartScan = () => {
    if (hasCameraPermission === false) {
       toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Cannot start scan without camera permissions.',
      });
      return;
    }
     if (!isCameraOn) {
      getCameraPermission();
    } else {
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setIsCameraOn(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95); // Use high-quality JPEG
      setCapturedImages([...capturedImages, dataUrl]);
    }
  };

  const clearBundle = () => {
    setCapturedImages([]);
    if (!isCameraOn) {
      getCameraPermission();
    }
  };
  
  const generatePdf = async () => {
    if (capturedImages.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'No images captured to generate PDF.' });
      return;
    }
    
    // Using 'p' for portrait orientation
    const doc = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();
    
    for (let i = 0; i < capturedImages.length; i++) {
        const imgData = capturedImages[i];
        const img = new (window as any).Image();
        img.src = imgData;
        await new Promise(resolve => img.onload = resolve);

        const imgProps = doc.getImageProperties(imgData);
        const imgAspectRatio = imgProps.width / imgProps.height;
        const pdfAspectRatio = pdfWidth / pdfHeight;

        let finalImgWidth = pdfWidth;
        let finalImgHeight = pdfHeight;
        
        if (imgAspectRatio > pdfAspectRatio) {
            finalImgHeight = pdfWidth / imgAspectRatio;
        } else {
            finalImgWidth = pdfHeight * imgAspectRatio;
        }

        const x = (pdfWidth - finalImgWidth) / 2;
        const y = (pdfHeight - finalImgHeight) / 2;

        if (i > 0) {
            doc.addPage();
        }
        doc.addImage(imgData, 'JPEG', x, y, finalImgWidth, finalImgHeight);
    }
    
    const pdfDataUri = doc.output('datauristring');
    setFileName(`scan-bundle-${new Date().toISOString().split('T')[0]}.pdf`);
    
    (window as any).generatedPdfData = pdfDataUri;
    setIsSaveDialogOpen(true);
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const pdfDataUri = (window as any).generatedPdfData;
    if (!pdfDataUri || !fileName || !selectedCourseId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please provide a filename and select a course.' });
        return;
    }
    const newFile: FileType = {
        id: `${selectedCourseId}-${Date.now()}`,
        name: fileName,
        type: 'application/pdf',
        dateAdded: new Date().toLocaleDateString(),
        url: pdfDataUri,
    };
    addFile(selectedCourseId, newFile);
    toast({ title: 'Success', description: 'PDF saved to your course repository.' });
    
    setCapturedImages([]);
    setFileName('');
    setSelectedCourseId('');
    setIsSaveDialogOpen(false);
    delete (window as any).generatedPdfData;
  }

  return (
    <div>
      <PageHeader title="Document Scanner" />
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="flex flex-col text-center p-8 bg-card/60 backdrop-blur-sm">
          {hasCameraPermission === false && (
             <Alert variant="destructive" className="mb-4">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser to use the scanner.
              </AlertDescription>
            </Alert>
          )}

          <div className="relative w-full aspect-video bg-muted rounded-md flex items-center justify-center">
            <video ref={videoRef} className={cn("w-full aspect-video rounded-md", !isCameraOn && "hidden")} autoPlay muted />
             {!isCameraOn && <Camera className="w-24 h-24 text-accent" />}
             <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <div className="flex gap-4 mt-6 justify-center">
             <Button size="lg" onClick={handleStartScan}>
                {isCameraOn ? <VideoOff className="mr-2" /> : <Video className="mr-2" />}
                {isCameraOn ? 'Stop Camera' : 'Start Camera'}
              </Button>
               <Button size="lg" onClick={captureImage} disabled={!isCameraOn}>
                <Camera className="mr-2" />
                Capture Page
              </Button>
          </div>
          
          {capturedImages.length > 0 && (
             <div className="w-full text-left mt-6">
                <h3 className="font-semibold mb-2">Captured Pages ({capturedImages.length})</h3>
                <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                    <div className="flex w-max space-x-4 p-4">
                        {capturedImages.map((imgSrc, index) => (
                             <Image key={index} src={imgSrc} alt={`Captured page ${index + 1}`} width={80} height={100} className="rounded-md object-cover border" />
                        ))}
                    </div>
                     <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <div className="flex gap-4 mt-4 justify-end">
                    <Button variant="destructive" onClick={clearBundle}>
                        <Trash2 className="mr-2"/> Clear Bundle
                    </Button>
                     <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                      <DialogTrigger asChild>
                         <Button onClick={generatePdf}>
                            <Layers className="mr-2" />
                            Generate PDF
                        </Button>
                      </DialogTrigger>
                       <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-sm">
                         <form onSubmit={handleSave}>
                            <DialogHeader>
                            <DialogTitle>Save PDF Document</DialogTitle>
                            <DialogDescription>
                                Name your PDF and select the course to save it to.
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                               <div className="space-y-2">
                                    <Label htmlFor="file-name">File Name</Label>
                                    <Input id="file-name" value={fileName} onChange={e => setFileName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="course">Course</Label>
                                    <Select onValueChange={setSelectedCourseId} value={selectedCourseId} required>
                                        <SelectTrigger id="course">
                                            <SelectValue placeholder="Select a course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {courses.map(course => <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                              <Button type="submit">Save PDF</Button>
                            </DialogFooter>
                         </form>
                      </DialogContent>
                    </Dialog>
                </div>
             </div>
          )}
        </Card>

        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Files</CardTitle>
            <CardDescription>Your last 3 scanned documents.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentFiles.length > 0 ? recentFiles.map(file => (
                 <li key={file.id} className="flex items-center gap-4 p-3 rounded-lg bg-background/50">
                    {file.type.startsWith('image/') ? (
                      <Image src={file.url} alt={file.name} width={60} height={75} className="rounded-md border object-cover" />
                    ) : (
                      <div className="w-[60px] h-[75px] flex items-center justify-center bg-muted rounded-md">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-muted-foreground">Added on: {file.dateAdded}</p>
                    </div>
                </li>
              )) : (
                <li className="text-center text-muted-foreground py-4">
                    No recently scanned documents.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
