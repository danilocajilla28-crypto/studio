import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Camera, FileText } from 'lucide-react';
import Image from 'next/image';

export default function ScannerPage() {
  return (
    <div>
      <PageHeader title="Document Scanner" />
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="flex flex-col items-center justify-center text-center p-8 bg-card/60 backdrop-blur-sm">
          <Camera className="w-24 h-24 mb-6 text-accent" />
          <CardTitle className="mb-2 font-headline">Capture and Digitize</CardTitle>
          <CardDescription className="mb-6 max-w-sm">
            Use your device's camera to capture documents, notes, and whiteboards. They will be automatically converted into high-quality PDFs.
          </CardDescription>
          <Button size="lg">
            <Camera className="mr-2" />
            Scan New Document
          </Button>
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
