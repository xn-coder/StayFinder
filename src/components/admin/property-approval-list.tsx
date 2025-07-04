
'use client';

import { useProperties } from '@/hooks/use-properties';
import type { Property } from '@/types';
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
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PropertyApprovalList() {
  const { properties, updatePropertyStatus, loading } = useProperties();
  const { toast } = useToast();

  const handleApproval = (id: string, newStatus: 'approved' | 'rejected') => {
    updatePropertyStatus(id, newStatus);
    toast({
      title: `Property ${newStatus}`,
      description: `The property listing has been ${newStatus}.`,
    });
  };

  const statusVariant = (status: Property['status']) => {
    switch (status) {
      case 'approved':
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
      <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
      <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
    </TableRow>
  )

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property Name</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : properties.map(property => (
            <TableRow key={property.id}>
              <TableCell className="font-medium">{property.name}</TableCell>
              <TableCell>{property.host?.name || 'Unknown Host'}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(property.status)} className="capitalize">
                  {property.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {property.status === 'pending' && (
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApproval(property.id, 'approved')}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleApproval(property.id, 'rejected')}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
