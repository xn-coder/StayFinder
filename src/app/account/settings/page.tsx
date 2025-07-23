
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, ShieldQuestion, UploadCloud, Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function SettingsPage() {
  const { user, submitForVerification } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (user === undefined || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading or redirecting...</p>
      </div>
    );
  }

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload an image smaller than 1MB.',
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setImagePreview(result);
        }
      };
      reader.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: 'There was an error reading the image file.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imagePreview) {
      toast({
        variant: 'destructive',
        title: 'No document selected',
        description: 'Please select a document to upload.',
      });
      return;
    }
    
    setIsUploading(true);
    await submitForVerification(user.id, imagePreview);
    setIsUploading(false);
    setImagePreview(null);
    setShowSuccessDialog(true);
  };

  const VerificationStatus = () => {
    switch (user.verificationStatus) {
      case 'verified':
        return <Badge variant="default" className="gap-1.5 pl-1.5"><ShieldCheck className="h-4 w-4" />Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="gap-1.5 pl-1.5"><ShieldAlert className="h-4 w-4" />Pending Review</Badge>;
      case 'unverified':
      case 'rejected':
        return <Badge variant="destructive" className="gap-1.5 pl-1.5"><ShieldQuestion className="h-4 w-4" />{user.verificationStatus === 'rejected' ? 'Rejected' : 'Unverified'}</Badge>;
      default:
        return <Badge variant="destructive" className="gap-1.5 pl-1.5"><ShieldQuestion className="h-4 w-4" />Unverified</Badge>;
    }
  };

  const isUnverifiedOrRejected = user.verificationStatus === 'unverified' || user.verificationStatus === 'rejected';

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
              <h2 className="text-xl text-muted-foreground">Welcome back, {user.name.split(' ')[0]}!</h2>
              <h1 className="text-4xl font-bold font-headline">Account Settings</h1>
              <p className="text-muted-foreground mt-2">
                  Manage your account and preferences.
              </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline">Change Photo</Button>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue={user.name} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={`${user.name.split(' ')[0].toLowerCase()}@easystays.com`} disabled />
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>
            <Card>
              <CardHeader>
                  <CardTitle>Identity Verification</CardTitle>
                  <CardDescription>To protect our community, we require all users to be verified.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <p className="font-medium">Verification Status</p>
                  <VerificationStatus />
                </div>
                {user.verificationStatus === 'rejected' && (
                    <Alert variant="destructive">
                      <AlertTitle>Verification Rejected</AlertTitle>
                      <AlertDescription>Your previous submission was rejected. Please upload a clear, valid government-issued ID.</AlertDescription>
                    </Alert>
                )}
                {isUnverifiedOrRejected && (
                  <div className="space-y-4">
                    <div className="text-center p-4 border-2 border-dashed rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        {imagePreview ? 'Selected Document Preview:' : 'Please upload a government-issued ID to get verified.'}
                      </p>
                      {imagePreview ? (
                        <div className="mb-4 relative w-full h-48">
                          <Image src={imagePreview} alt="ID Preview" layout="fill" objectFit="contain" />
                        </div>
                      ) : (
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      )}
                      <input
                        type="file"
                        ref={imageInputRef}
                        onChange={handleImageFileChange}
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                      />
                      <Button variant="outline" onClick={() => imageInputRef.current?.click()} disabled={isUploading}>
                        {imagePreview ? 'Change File' : 'Choose File'}
                      </Button>
                    </div>
                    {imagePreview && (
                      <Button onClick={handleSubmit} disabled={isUploading} className="w-full">
                        {isUploading ? <Loader2 className="mr-2 animate-spin" /> : <Send className="mr-2"/>}
                        Submit for Verification
                      </Button>
                    )}
                  </div>
                )}
                 {user.verificationStatus === 'pending' && (
                  <div className="text-center p-6 bg-accent rounded-lg">
                    <p className="text-accent-foreground">
                      Your document has been submitted and is currently under review. We'll notify you once the process is complete.
                    </p>
                  </div>
                )}
                {user.verificationStatus === 'verified' && (
                   <div className="text-center p-6 bg-accent rounded-lg flex items-center justify-center gap-4">
                    <ShieldCheck className="h-8 w-8 text-green-600" />
                    <p className="text-accent-foreground font-semibold">
                      You're all set! Your identity has been verified.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Successfully Applied!</DialogTitle>
            <DialogDescription>
              Your identity document has been submitted for verification. We will get back to you soon once it has been reviewed by an admin.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
