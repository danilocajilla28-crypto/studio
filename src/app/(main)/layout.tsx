import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import {
  BrainCircuit,
  Calendar,
  Compass,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  MessageSquare,
  ScanLine,
  User,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/schedule', icon: Calendar, label: 'Schedule' },
  { href: '/tasks', icon: ListTodo, label: 'Tasks' },
  { href: '/courses', icon: FolderKanban, label: 'Courses' },
  { href: '/scanner', icon: ScanLine, label: 'Scanner' },
  { href: '/ai-predictions', icon: BrainCircuit, label: 'AI Predictions' },
  { href: '/messages', icon: MessageSquare, label: 'Messages' },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Compass className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold font-headline">CourseCompass</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenuButton asChild tooltip="Profile">
              <Link href="/profile">
                  <Avatar className="w-7 h-7">
                      <AvatarImage src="https://placehold.co/40x40.png" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span>Profile</span>
              </Link>
           </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-6 lg:p-8">
            <div className="md:hidden mb-4 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Compass className="w-6 h-6 text-primary" />
                    <h1 className="text-lg font-semibold font-headline">CourseCompass</h1>
                 </div>
                <SidebarTrigger />
            </div>
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
