'use client';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Camera, FileText, Video, VideoOff, RefreshCw, Upload, Download, Save } from 'lucide-react';
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


export default function ScannerPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { courses, addFile, files } = useUserData();

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  
  const recentFiles = Object.values(files).flat().filter(f => f.type.startsWith('image/')).slice(0, 3);


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
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
      setFileName(`scan-${new Date().toISOString().split('T')[0]}.png`);
       const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      setIsCameraOn(false);
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setFileName('');
    setSelectedCourseId('');
    getCameraPermission();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capturedImage || !fileName || !selectedCourseId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please provide a filename and select a course.' });
        return;
    }
    const newFile: FileType = {
        id: `${selectedCourseId}-${Date.now()}`,
        name: fileName,
        type: 'image/png', // assuming png from canvas
        dateAdded: new Date().toLocaleDateString(),
        url: capturedImage,
    };
    addFile(selectedCourseId, newFile);
    toast({ title: 'Success', description: 'File saved to your course repository.' });
    
    // Reset state
    setCapturedImage(null);
    setFileName('');
    setSelectedCourseId('');
    setIsSaveDialogOpen(false);
  }

  return (
    <div>
      <PageHeader title="Document Scanner" />
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="flex flex-col items-center justify-center text-center p-8 bg-card/60 backdrop-blur-sm">
          {hasCameraPermission === false && (
             <Alert variant="destructive" className="mb-4">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser to use the scanner.
              </AlertDescription>
            </Alert>
          )}

          {!capturedImage ? (
            <div className="relative w-full aspect-video bg-muted rounded-md flex items-center justify-center">
              <video ref={videoRef} className={cn("w-full aspect-video rounded-md", !isCameraOn && "hidden")} autoPlay muted />
               {!isCameraOn && <Camera className="w-24 h-24 text-accent" />}
               <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : (
            <div className="relative w-full aspect-video">
              <Image src={capturedImage} alt="Captured document" layout="fill" objectFit="contain" className="rounded-md"/>
            </div>
          )}
          
          <div className="flex gap-4 mt-6">
            {!capturedImage ? (
                 <>
                  <Button size="lg" onClick={handleStartScan}>
                    {isCameraOn ? <VideoOff className="mr-2" /> : <Video className="mr-2" />}
                    {isCameraOn ? 'Stop Camera' : 'Start Camera'}
                  </Button>
                   <Button size="lg" onClick={captureImage} disabled={!isCameraOn}>
                    <Camera className="mr-2" />
                    Capture
                  </Button>
                </>
            ) : (
                <>
                    <Button size="lg" onClick={retakeImage}>
                        <RefreshCw className="mr-2" />
                        Retake
                    </Button>
                    <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                      <DialogTrigger asChild>
                         <Button size="lg">
                            <Save className="mr-2" />
                            Save
                        </Button>
                      </DialogTrigger>
                       <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-sm">
                         <form onSubmit={handleSave}>
                            <DialogHeader>
                            <DialogTitle>Save Scanned Document</DialogTitle>
                            <DialogDescription>
                                Name your file and select the course to save it to.
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
                              <Button type="submit">Save Document</Button>
                            </DialogFooter>
                         </form>
                      </DialogContent>
                    </Dialog>
                </>
            )}
          </div>
        </Card>

        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recently Scanned</CardTitle>
            <CardDescription>Your last 3 scanned documents.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentFiles.length > 0 ? recentFiles.map(file => (
                 <li key={file.id} className="flex items-center gap-4 p-3 rounded-lg bg-background/50">
                    <Image src={file.url} alt={file.name} width={60} height={75} className="rounded-md border object-cover" />
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
