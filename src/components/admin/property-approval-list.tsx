
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
import { Check, X, Trash2, Ban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
import { useMemo } from 'react';

export function PropertyApprovalList() {
  const { properties, updatePropertyStatus, deleteProperty, loading } = useProperties();
  const { toast } = useToast();

  const uniqueProperties = useMemo(() => {
    const seen = new Set();
    return properties.filter(prop => {
      const duplicate = seen.has(prop.id);
      seen.add(prop.id);
      return !duplicate;
    });
  }, [properties]);

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    const statusText = newStatus === 'approved' ? 'approved' : 'disabled';
    updatePropertyStatus(id, newStatus);
    toast({
      title: `Property ${newStatus === 'approved' ? 'Approved' : 'Disabled'}`,
      description: `The property listing has been ${statusText}.`,
    });
  };
  
  const handleDelete = (id: string) => {
    deleteProperty(id);
    toast({
        title: 'Property Deleted',
        description: 'The property has been successfully removed.',
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
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
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
          ) : uniqueProperties.map(property => (
            <TableRow key={property.id}>
              <TableCell className="font-medium">{property.name}</TableCell>
              <TableCell>{property.host?.name || 'Unknown Host'}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(property.status)} className="capitalize">
                  {property.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  {property.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(property.id, 'approved')}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleStatusChange(property.id, 'rejected')}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                  {property.status === 'approved' && (
                     <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusChange(property.id, 'rejected')}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Disable
                    </Button>
                  )}
                  {property.status === 'rejected' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(property.id, 'approved')}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Enable
                    </Button>
                  )}
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
                              This action cannot be undone. This will permanently delete this property listing.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(property.id)}>
                                Delete
                              </AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
