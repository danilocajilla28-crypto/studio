'use client';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Camera, FileText, Video, VideoOff, RefreshCw, Upload, Download } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function ScannerPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

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
       const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      setIsCameraOn(false);
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
    getCameraPermission();
  };

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
                     <Button size="lg" onClick={() => { /* Add save logic */ }}>
                        <Download className="mr-2" />
                        Save
                    </Button>
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
              <li className="flex items-center gap-4 p-3 rounded-lg bg-background/50">
                <Image src="https://placehold.co/80x100.png" alt="scanned doc" width={60} height={75} className="rounded-md border" data-ai-hint="document page" />
                <div>
                  <p className="font-semibold">Lecture Notes - Week 5.pdf</p>
                  <p className="text-sm text-muted-foreground">Scanned on: 2024-06-03</p>
                </div>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg bg-background/50">
                <Image src="https://placehold.co/80x100.png" alt="scanned doc" width={60} height={75} className="rounded-md border" data-ai-hint="receipt invoice" />
                <div>
                  <p className="font-semibold">Lab Equipment Receipt.pdf</p>
                  <p className="text-sm text-muted-foreground">Scanned on: 2024-06-01</p>
                </div>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg bg-background/50">
                <Image src="https://placehold.co/80x100.png" alt="scanned doc" width={60} height={75} className="rounded-md border" data-ai-hint="textbook chapter" />
                <div>
                  <p className="font-semibold">Chapter 2 Reading.pdf</p>
                  <p className="text-sm text-muted-foreground">Scanned on: 2024-05-29</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
