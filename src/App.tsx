import { useState, useEffect } from 'react';
import { User, Booking, Activity } from './types';
import LoginScreen from './components/LoginScreen';
import Navigation from './components/Navigation';
import DeskBooking from './components/DeskBooking';
import SocialFeed from './components/SocialFeed';
import { Users, Calendar } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'social'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedBookings = localStorage.getItem('bookings');
    const savedActivities = localStorage.getItem('activities');

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  // Save bookings to localStorage when they change
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

  // Save activities to localStorage when they change
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('activities', JSON.stringify(activities));
    }
  }, [activities]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <Navigation 
        user={currentUser} 
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-white text-primary-600 border-b-2 border-primary-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="inline-block w-5 h-5 mr-2" />
              Desk Bookings
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === 'social'
                  ? 'bg-white text-primary-600 border-b-2 border-primary-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="inline-block w-5 h-5 mr-2" />
              Social Activities
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'bookings' ? (
              <DeskBooking
                currentUser={currentUser}
                bookings={bookings}
                onBookingsChange={setBookings}
              />
            ) : (
              <SocialFeed
                currentUser={currentUser}
                activities={activities}
                onActivitiesChange={setActivities}
                bookings={bookings}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
