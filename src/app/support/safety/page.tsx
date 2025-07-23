
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Shield, ShieldQuestion, PartyPopper, ShieldAlert, Home, HelpCircle, MessageSquare, PhoneCall } from 'lucide-react';

export default function SafetySupportPage() {
  const { user } = useAuth();
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [conversationStep, setConversationStep] = useState(0);

  const handleIssueClick = (issue: string) => {
    setSelectedIssue(issue);
    setConversationStep(1);
  };

  const supportIssues = [
    { text: "Privacy concerns", icon: ShieldQuestion },
    { text: "Party at my property", icon: PartyPopper },
    { text: "Violence or threats", icon: ShieldAlert },
    { text: "Property damage", icon: Home },
    { text: "I need help with something else", icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* --- Initial Support Agent Messages --- */}
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary flex-shrink-0">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="Support Agent" data-ai-hint="support agent" />
                  <AvatarFallback><Shield /></AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div className="bg-background rounded-xl rounded-tl-none p-4 shadow-sm border w-fit max-w-md">
                  <p className="font-semibold mb-1 text-primary">EasyStays Support</p>
                  <p>
                    Hi {user ? user.name.split(' ')[0] : 'there'}, if there’s an emergency in progress, let’s get you connected with local emergency services now.
                  </p>
                </div>
                
                <div className="bg-background rounded-xl rounded-tl-none p-3 shadow-sm border w-fit">
                   <a href="tel:911" className="w-full">
                      <Button variant="destructive">
                        <Phone className="mr-2" />
                        Dial emergency services
                      </Button>
                    </a>
                </div>

                <div className="bg-background rounded-xl rounded-tl-none p-4 shadow-sm border w-fit max-w-md">
                  <p>
                    If you need help from EasyStays, select the issue you’re experiencing. This info helps us get you to the right person faster.
                  </p>
                </div>

                {conversationStep === 0 && (
                  <div className="bg-background rounded-xl rounded-tl-none p-4 shadow-sm border w-fit">
                    <div className="space-y-3">
                      {supportIssues.map(({ text, icon: Icon }) => (
                         <Button key={text} variant="outline" className="w-full justify-start text-base h-12" onClick={() => handleIssueClick(text)}>
                          <Icon className="mr-3" />
                          {text}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- Conversation Steps --- */}
            {conversationStep > 0 && selectedIssue && (
              <>
                {/* User's Message */}
                <div className="flex items-start gap-4 justify-end">
                  <div className="flex-1 space-y-4 text-right">
                    <div className="bg-primary text-primary-foreground rounded-xl rounded-tr-none p-4 shadow-sm border w-fit max-w-md ml-auto">
                      <p>{selectedIssue}</p>
                    </div>
                  </div>
                   <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                      <AvatarFallback>{user ? user.name.charAt(0) : 'U'}</AvatarFallback>
                  </Avatar>
                </div>

                {/* Support's Follow-up */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary flex-shrink-0">
                      <AvatarImage src="https://placehold.co/100x100.png" alt="Support Agent" data-ai-hint="support agent" />
                      <AvatarFallback><Shield /></AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                      <div className="bg-background rounded-xl rounded-tl-none p-4 shadow-sm border w-fit max-w-md">
                          <p className="font-semibold mb-1 text-primary">EasyStays Support</p>
                          <p>Let’s get you connected to a member of our team. How would you like to connect with us?</p>
                      </div>
                      <div className="bg-background rounded-xl rounded-tl-none p-4 shadow-sm border w-fit">
                          <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start text-base h-12">
                              <MessageSquare className="mr-3" /> Chat with an agent
                            </Button>
                             <Button variant="outline" className="w-full justify-start text-base h-12">
                              <PhoneCall className="mr-3" /> Request a call
                            </Button>
                          </div>
                      </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
