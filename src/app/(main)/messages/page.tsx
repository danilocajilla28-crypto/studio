import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { messagesData, userProfileData } from '@/lib/data';
import { Send, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const contacts = [
    { id: 'group-cs101', name: 'CS101 Group', type: 'group', avatar: 'https://placehold.co/40x40/673ab7/ffffff.png?text=CS' },
    { id: 'group-ai301', name: 'AI301 Group', type: 'group', avatar: 'https://placehold.co/40x40/3f51b5/ffffff.png?text=AI' },
    { id: 'dm-jane', name: 'Jane Smith', type: 'dm', avatar: 'https://placehold.co/40x40.png' },
]

export default function MessagesPage() {
    const activeChat = 'dm-jane';
    const activeContact = contacts.find(c => c.id === activeChat);
    const chatMessages = messagesData[activeChat] || [];
  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <PageHeader title="Messaging" />
      <Card className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0 overflow-hidden bg-card/60 backdrop-blur-sm">
        <div className="md:col-span-1 lg:col-span-1 border-r flex flex-col">
            <div className='p-4 border-b'>
                 <Input placeholder="Search messages..." />
            </div>
            <ScrollArea className="flex-1">
                {contacts.map(contact => (
                    <div key={contact.id} className={cn("flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50", activeChat === contact.id && "bg-muted")}>
                        <Avatar>
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback>{contact.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">{contact.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{messagesData[contact.id]?.[messagesData[contact.id].length - 1].text}</p>
                        </div>
                        {contact.type === 'group' ? <Users className="w-4 h-4 text-muted-foreground" /> : <User className="w-4 h-4 text-muted-foreground" />}
                    </div>
                ))}
            </ScrollArea>
        </div>
        <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full">
            <div className="p-4 border-b flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={activeContact?.avatar} />
                    <AvatarFallback>{activeContact?.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-semibold">{activeContact?.name}</h2>
            </div>
            <ScrollArea className="flex-1 p-6 bg-background/40">
                <div className="space-y-6">
                    {chatMessages.map(msg => (
                         <div key={msg.id} className={cn("flex items-end gap-3", msg.sender === 'You' ? 'justify-end' : 'justify-start')}>
                             {msg.sender !== 'You' && <Avatar className="w-8 h-8"><AvatarImage src={msg.avatar} /></Avatar>}
                             <div className={cn("max-w-xs lg:max-w-md p-3 rounded-lg", msg.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                 <p className="text-sm">{msg.text}</p>
                                 <p className="text-xs text-right mt-1 opacity-70">{msg.timestamp}</p>
                             </div>
                             {msg.sender === 'You' && <Avatar className="w-8 h-8"><AvatarImage src={msg.avatar} /></Avatar>}
                         </div>
                    ))}
                </div>
            </ScrollArea>
            <div className="p-4 border-t mt-auto">
                <div className="flex items-center gap-2">
                    <Input placeholder="Type a message..." className="flex-1" />
                    <Button><Send className="w-4 h-4" /></Button>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
}
