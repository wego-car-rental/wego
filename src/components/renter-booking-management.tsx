'use client';

import type { Booking } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export function RenterBookingManagement({ bookings }: { bookings: Booking[] }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const bookingRef = doc(firestore, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: 'cancelled' });
      toast({        title: 'Booking Cancelled',
        description: 'Your booking has been successfully cancelled.',
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({        title: 'Error',
        description: 'There was an error cancelling your booking. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Booking #{booking.id.slice(0, 6)}...</CardTitle>
            <span className={`px-2 py-1 text-sm font-semibold rounded-full ${{
              pending: 'bg-yellow-200 text-yellow-800',
              confirmed: 'bg-green-200 text-green-800',
              cancelled: 'bg-red-200 text-red-800',
            }[booking.status]}`}>
              {booking.status}
            </span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold">Details</h3>
                <p><strong>Pickup:</strong> {booking.pickupDate.toDate().toLocaleDateString()} at {booking.pickupTime}</p>
                <p><strong>Drop-off:</strong> {booking.dropoffDate.toDate().toLocaleDateString()} at {booking.dropoffTime}</p>
              </div>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p><strong>From:</strong> {booking.pickupLocation}</p>
                <p><strong>To:</strong> {booking.dropoffLocation}</p>
              </div>
              <div>
                <h3 className="font-semibold">Actions</h3>
                {booking.status === 'pending' && (
                  <Button variant="destructive" onClick={() => handleCancelBooking(booking.id)}>
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
