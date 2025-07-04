
'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import type { User } from '@/types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

export function IdentityVerificationList() {
  const { users, updateVerificationStatus } = useAuth();
  const { toast } = useToast();
  const [viewingDocumentUrl, setViewingDocumentUrl] = useState<string | null>(null);

  const pendingUsers = useMemo(() => {
    return users.filter(user => user.verificationStatus === 'pending');
  }, [users]);

  const handleDecision = (userId: string, newStatus: 'verified' | 'rejected') => {
    const statusText = newStatus === 'verified' ? 'approved' : 'rejected';
    updateVerificationStatus(userId, newStatus);
    toast({
      title: `Verification ${statusText}`,
      description: `The user's identity has been ${statusText}.`,
    });
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Document</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingUsers.length > 0 ? (
              pendingUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                      <Badge variant="outline" className="capitalize">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.identityDocumentUrl && (
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => setViewingDocumentUrl(user.identityDocumentUrl!)}
                      >
                        View Document <Eye className="ml-2 h-4 w-4"/>
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                          <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecision(user.id, 'verified')}
                          >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                          </Button>
                          <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDecision(user.id, 'rejected')}
                          >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                          </Button>
                      </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No pending identity verifications.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewingDocumentUrl} onOpenChange={(isOpen) => !isOpen && setViewingDocumentUrl(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Identity Document</DialogTitle>
            <DialogDescription>Review the submitted document below.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 relative h-[60vh]">
            {viewingDocumentUrl && (
              <Image 
                src={viewingDocumentUrl} 
                alt="Identity Document" 
                layout="fill" 
                objectFit="contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
