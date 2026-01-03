'use client';

import type { Booking, Car, User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { format } from 'date-fns';

export function DriverDashboard({ 
  driver,
  bookings, 
  cars,
  loading 
}: { 
  driver: User;
  bookings: Booking[] | null;
  cars: Car[] | null;
  loading: boolean;
}) {
  const driverBookings = bookings?.filter(b => b.driverId === driver.id) || [];

  const activeTrips = driverBookings.filter(b => b.status === 'approved');
  const completedTrips = driverBookings.filter(b => b.status === 'completed');
  const upcomingTrips = driverBookings.filter(b => b.status === 'pending');

  // Calculate earnings and rating
  const totalEarnings = completedTrips.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const averageRating = completedTrips.length > 0
    ? completedTrips.reduce((sum, b) => sum + (5), 0) / completedTrips.length // placeholder, assuming 5
    : 5;

  const getStatusVariant = (status: Booking['status']) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'outline';
      case 'rejected':
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Driver Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {driver.displayName}! Manage your rentals and earnings.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTrips.length}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTrips.length}</div>
            <p className="text-xs text-muted-foreground">All time completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTrips.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarnings.toLocaleString()} RWF</div>
            <p className="text-xs text-muted-foreground">From completed rentals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Rentals */}
      <Card>
        <CardHeader>
          <CardTitle>Active Rentals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rental ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Renter</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeTrips.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    {cars?.find(c => c.id === booking.carId)?.brand} {cars?.find(c => c.id === booking.carId)?.model}
                  </TableCell>
                  <TableCell>{booking.customerId.slice(0, 8)}</TableCell>
                  <TableCell>
                    {format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d')}
                  </TableCell>
                  <TableCell>{booking.totalPrice?.toLocaleString()} RWF</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Update Status</Button>
                  </TableCell>
                </TableRow>
              ))}
              {activeTrips.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No active rentals</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Rentals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Rentals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rental ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Renter</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingTrips.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    {cars?.find(c => c.id === booking.carId)?.brand} {cars?.find(c => c.id === booking.carId)?.model}
                  </TableCell>
                  <TableCell>{booking.customerId.slice(0, 8)}</TableCell>
                  <TableCell>
                    {format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d')}
                  </TableCell>
                  <TableCell>{booking.totalPrice?.toLocaleString()} RWF</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Accept Rental</Button>
                  </TableCell>
                </TableRow>
              ))}
              {upcomingTrips.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No pending rentals</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
