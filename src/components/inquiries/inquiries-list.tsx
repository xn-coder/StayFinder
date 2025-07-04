'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { useProperties } from '@/hooks/use-properties';
import type { Inquiry, InquiryStatus } from '@/types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export function InquiriesList() {
  const { user } = useAuth();
  const { inquiries, updateInquiryStatus, loading } = useProperties();
  const { toast } = useToast();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const hostInquiries = useMemo(() => {
    if (!user) return [];
    return inquiries
      .filter(inquiry => inquiry.property.host.id === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [user, inquiries]);

  const handleStatusChange = (id: string, newStatus: 'accepted' | 'rejected') => {
    updateInquiryStatus(id, newStatus);
    toast({
      title: `Inquiry ${newStatus}`,
      description: `The inquiry has been ${newStatus}.`,
    });
  };

  const statusVariant = (status: InquiryStatus) => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-5 w-1/4" /></TableCell>
      <TableCell><Skeleton className="h-5 w-1/4" /></TableCell>
      <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
    </TableRow>
  )

  if (!user) return null;

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : hostInquiries.length > 0 ? (
              hostInquiries.map(inquiry => (
                <TableRow key={inquiry.id} onClick={() => setSelectedInquiry(inquiry)} className="cursor-pointer">
                  <TableCell className="font-medium">{inquiry.property.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={inquiry.guest.avatar} alt={inquiry.guest.name} />
                        <AvatarFallback>{inquiry.guest.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{inquiry.guest.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                      {format(new Date(inquiry.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(inquiry.status)} className="capitalize">
                      {inquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {inquiry.status === 'pending' && (
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(inquiry.id, 'accepted'); }}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                           onClick={(e) => { e.stopPropagation(); handleStatusChange(inquiry.id, 'rejected'); }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                      You have no inquiries yet.
                  </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {selectedInquiry && (
        <Dialog open={!!selectedInquiry} onOpenChange={(isOpen) => !isOpen && setSelectedInquiry(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Inquiry from {selectedInquiry.guest.name}</DialogTitle>
                    <DialogDescription>For property: {selectedInquiry.property.name}</DialogDescription>
                </DialogHeader>
                <div className="py-4 whitespace-pre-wrap bg-muted rounded-md p-4 max-h-64 overflow-y-auto">
                    {selectedInquiry.message}
                </div>
                <DialogFooter>
                    <Button onClick={() => setSelectedInquiry(null)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
