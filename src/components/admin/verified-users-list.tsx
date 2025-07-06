
'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import type { User, UserVerificationStatus } from '@/types';
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
import { Eye, ShieldCheck, ShieldAlert, ShieldQuestion, Trash2, Ban, UserCheck } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const VerificationStatusBadge = ({ status }: { status: UserVerificationStatus }) => {
  switch (status) {
    case 'verified':
      return <Badge variant="default" className="gap-1.5 pl-1.5"><ShieldCheck className="h-4 w-4" />Verified</Badge>;
    case 'pending':
      return <Badge variant="secondary" className="gap-1.5 pl-1.5"><ShieldAlert className="h-4 w-4" />Pending</Badge>;
    case 'unverified':
      return <Badge variant="destructive" className="gap-1.5 pl-1.5"><ShieldQuestion className="h-4 w-4" />Unverified</Badge>;
    case 'rejected':
      return <Badge variant="destructive" className="gap-1.5 pl-1.5"><ShieldQuestion className="h-4 w-4" />Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function AllUsersList() {
  const { users, deleteUser, toggleUserStatus } = useAuth();
  const { toast } = useToast();
  const [viewingDocumentUrl, setViewingDocumentUrl] = useState<string | null>(null);

  const sortedUsers = useMemo(() => {
    // Show super-admin first, then sort by name
    return [...users].sort((a, b) => {
        if (a.role === 'super-admin' && b.role !== 'super-admin') return -1;
        if (a.role !== 'super-admin' && b.role === 'super-admin') return 1;
        return a.name.localeCompare(b.name);
    });
  }, [users]);
  
  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    toast({
      title: 'User Deleted',
      description: 'The user has been successfully removed.',
    });
  };

  const handleToggleStatus = (userId: string, isDisabled: boolean | undefined) => {
    toggleUserStatus(userId);
    toast({
      title: `User ${isDisabled ? 'Enabled' : 'Disabled'}`,
      description: `The user account has been ${isDisabled ? 'enabled' : 'disabled'}.`,
    });
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Document</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length > 0 ? (
              sortedUsers.map(user => (
                <TableRow key={user.id} className={user.isDisabled ? 'bg-muted/50' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                      <Badge variant="outline" className="capitalize">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                        <VerificationStatusBadge status={user.verificationStatus} />
                        {user.isDisabled ? (
                           <Badge variant="destructive" className="gap-1.5 pl-1.5"><Ban className="h-4 w-4" />Disabled</Badge>
                        ) : (
                           <Badge variant="default" className="gap-1.5 pl-1.5 bg-green-600"><UserCheck className="h-4 w-4" />Enabled</Badge>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.identityDocumentUrl ? (
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => setViewingDocumentUrl(user.identityDocumentUrl!)}
                      >
                        View Document <Eye className="ml-2 h-4 w-4"/>
                      </Button>
                    ) : (
                        <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                   <TableCell className="text-right">
                    {user.role !== 'super-admin' && (
                      <div className="flex gap-2 justify-end">
                        <Button 
                            variant={user.isDisabled ? 'secondary' : 'destructive'} 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleToggleStatus(user.id, user.isDisabled)}
                        >
                            {user.isDisabled ? <UserCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the user account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                Delete User
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
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
