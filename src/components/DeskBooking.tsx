import { useState } from 'react';
import { User, Booking } from '../types';
import { Calendar, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface DeskBookingProps {
  currentUser: User;
  bookings: Booking[];
  onBookingsChange: (bookings: Booking[]) => void;
}

const MAX_DESKS = 15;

export default function DeskBooking({ currentUser, bookings, onBookingsChange }: DeskBookingProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Get next 14 days
  const getNextDays = (count: number) => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const days = getNextDays(14);

  const getBookingsForDate = (date: string) => {
    return bookings.filter(b => b.date === date);
  };

  const getUserBookingsCount = () => {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    return bookings.filter(b => 
      b.userId === currentUser.id &&
      new Date(b.date) >= startOfWeek &&
      new Date(b.date) < endOfWeek
    ).length;
  };

  const hasUserBookedDate = (date: string) => {
    return bookings.some(b => b.userId === currentUser.id && b.date === date);
  };

  const handleBookDesk = (date: string) => {
    const dateBookings = getBookingsForDate(date);
    
    if (hasUserBookedDate(date)) {
      setMessage({ type: 'error', text: 'You have already booked this day!' });
      return;
    }

    if (dateBookings.length >= MAX_DESKS) {
      setMessage({ type: 'error', text: 'Sorry, all desks are booked for this day!' });
      return;
    }

    const userWeeklyBookings = getUserBookingsCount();
    if (userWeeklyBookings >= 2) {
      setMessage({ type: 'error', text: 'You can only book 2 days per week!' });
      return;
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      date,
      deskNumber: dateBookings.length + 1,
    };

    onBookingsChange([...bookings, newBooking]);
    setMessage({ type: 'success', text: `Desk ${newBooking.deskNumber} booked successfully!` });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancelBooking = (date: string) => {
    const updatedBookings = bookings.filter(
      b => !(b.userId === currentUser.id && b.date === date)
    );
    onBookingsChange(updatedBookings);
    setMessage({ type: 'info', text: 'Booking cancelled successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const userWeeklyBookings = getUserBookingsCount();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Book Your Desk</h2>
          <p className="text-gray-600 mt-1">Select up to 2 days per week</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-lg">
          <Calendar className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-semibold text-primary-900">
            {userWeeklyBookings}/2 days booked this week
          </span>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' :
          message.type === 'error' ? 'bg-red-50 text-red-800' :
          'bg-blue-50 text-blue-800'
        }`}>
          {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {message.type === 'error' && <XCircle className="w-5 h-5" />}
          {message.type === 'info' && <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map(day => {
          const dateStr = formatDate(day);
          const dayBookings = getBookingsForDate(dateStr);
          const availableDesks = MAX_DESKS - dayBookings.length;
          const userBooked = hasUserBookedDate(dateStr);
          const isFullyBooked = availableDesks === 0;
          const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <div
              key={dateStr}
              className={`p-5 rounded-xl border-2 transition-all ${
                userBooked
                  ? 'border-primary-500 bg-primary-50'
                  : isFullyBooked || isPast
                  ? 'border-gray-200 bg-gray-50'
                  : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {day.getDate()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDisplayDate(day)}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  availableDesks === 0
                    ? 'bg-red-100 text-red-700'
                    : availableDesks <= 3
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {availableDesks} left
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <Users className="w-4 h-4" />
                <span>{dayBookings.length}/{MAX_DESKS} desks booked</span>
              </div>

              {!isPast && (
                userBooked ? (
                  <button
                    onClick={() => handleCancelBooking(dateStr)}
                    className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel Booking
                  </button>
                ) : (
                  <button
                    onClick={() => handleBookDesk(dateStr)}
                    disabled={isFullyBooked || userWeeklyBookings >= 2}
                    className={`w-full py-2 px-4 font-semibold rounded-lg transition-colors ${
                      isFullyBooked || userWeeklyBookings >= 2
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {isFullyBooked ? 'Fully Booked' : 'Book Desk'}
                  </button>
                )
              )}

              {isPast && (
                <div className="text-center text-sm text-gray-400 py-2">
                  Past Date
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Who's Coming In */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Who's in the Office?</h3>
        <div className="space-y-3">
          {days.slice(0, 7).map(day => {
            const dateStr = formatDate(day);
            const dayBookings = getBookingsForDate(dateStr);
            
            if (dayBookings.length === 0) return null;

            return (
              <div key={dateStr} className="bg-white rounded-lg p-4">
                <div className="font-semibold text-gray-900 mb-2">
                  {formatDisplayDate(day)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {dayBookings.map(booking => (
                    <div
                      key={booking.id}
                      className={`px-3 py-1 rounded-full text-sm ${
                        booking.userId === currentUser.id
                          ? 'bg-primary-100 text-primary-700 font-semibold'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {booking.userName}
                      {booking.userId === currentUser.id && ' (You)'}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

