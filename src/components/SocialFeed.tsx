import { useState } from 'react';
import { User, Activity, Booking } from '../types';
import { Plus, Coffee, Beer, Users, Calendar, Clock, MapPin } from 'lucide-react';

interface SocialFeedProps {
  currentUser: User;
  activities: Activity[];
  onActivitiesChange: (activities: Activity[]) => void;
  bookings: Booking[];
}

export default function SocialFeed({ currentUser, activities, onActivitiesChange, bookings }: SocialFeedProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'lunch' as 'lunch' | 'after-work',
    title: '',
    description: '',
    date: '',
    time: '',
    maxParticipants: 10,
  });

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    
    const activity: Activity = {
      id: Date.now().toString(),
      ...newActivity,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      participants: [currentUser.id],
    };

    onActivitiesChange([...activities, activity]);
    setShowCreateModal(false);
    setNewActivity({
      type: 'lunch',
      title: '',
      description: '',
      date: '',
      time: '',
      maxParticipants: 10,
    });
  };

  const handleJoinActivity = (activityId: string) => {
    const updatedActivities = activities.map(activity => {
      if (activity.id === activityId && !activity.participants.includes(currentUser.id)) {
        return {
          ...activity,
          participants: [...activity.participants, currentUser.id],
        };
      }
      return activity;
    });
    onActivitiesChange(updatedActivities);
  };

  const handleLeaveActivity = (activityId: string) => {
    const updatedActivities = activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          participants: activity.participants.filter(id => id !== currentUser.id),
        };
      }
      return activity;
    });
    onActivitiesChange(updatedActivities);
  };

  const getUsersInOfficeOnDate = (date: string) => {
    return bookings.filter(b => b.date === date);
  };

  const sortedActivities = [...activities].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const upcomingActivities = sortedActivities.filter(a => 
    new Date(a.date) >= new Date(new Date().setHours(0, 0, 0, 0))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Social Activities</h2>
          <p className="text-gray-600 mt-1">Connect with your colleagues</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Create Activity</span>
        </button>
      </div>

      {/* Suggested Activities */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 border-2 border-primary-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
          <Coffee className="w-5 h-5 mr-2 text-primary-600" />
          Suggested Activities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-4">
            <div className="font-semibold text-gray-900">☕ Lunch Breaks</div>
            <p className="text-sm text-gray-600 mt-1">Grab lunch with colleagues nearby</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="font-semibold text-gray-900">🍻 After-Work Drinks</div>
            <p className="text-sm text-gray-600 mt-1">Unwind with the team after work</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="font-semibold text-gray-900">🎮 Game Night</div>
            <p className="text-sm text-gray-600 mt-1">Board games or video games together</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="font-semibold text-gray-900">🏃 Fitness Activities</div>
            <p className="text-sm text-gray-600 mt-1">Run, yoga, or gym sessions</p>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {upcomingActivities.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities yet</h3>
            <p className="text-gray-600 mb-4">Be the first to create an activity!</p>
          </div>
        ) : (
          upcomingActivities.map(activity => {
            const isParticipant = activity.participants.includes(currentUser.id);
            const isFull = activity.maxParticipants && activity.participants.length >= activity.maxParticipants;
            const officeUsers = getUsersInOfficeOnDate(activity.date);

            return (
              <div key={activity.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-3 rounded-lg ${
                      activity.type === 'lunch' ? 'bg-orange-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'lunch' ? (
                        <Coffee className="w-6 h-6 text-orange-600" />
                      ) : (
                        <Beer className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Created by {activity.createdByName}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activity.type === 'lunch'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {activity.type === 'lunch' ? 'Lunch' : 'After Work'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(activity.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{activity.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      {activity.participants.length}
                      {activity.maxParticipants && `/${activity.maxParticipants}`} going
                    </span>
                  </div>
                </div>

                {officeUsers.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-900 font-semibold mb-1">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {officeUsers.length} people in office this day
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {officeUsers.slice(0, 5).map(booking => (
                        <span key={booking.id} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {booking.userName}
                        </span>
                      ))}
                      {officeUsers.length > 5 && (
                        <span className="text-xs text-blue-600">+{officeUsers.length - 5} more</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {activity.participants.slice(0, 5).map((participantId) => {
                      const booking = bookings.find(b => b.userId === participantId);
                      const name = booking?.userName || 'User';
                      return (
                        <div
                          key={participantId}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                          title={name}
                        >
                          {name.charAt(0).toUpperCase()}
                        </div>
                      );
                    })}
                    {activity.participants.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-semibold border-2 border-white">
                        +{activity.participants.length - 5}
                      </div>
                    )}
                  </div>

                  {isParticipant ? (
                    <button
                      onClick={() => handleLeaveActivity(activity.id)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinActivity(activity.id)}
                      disabled={!!isFull}
                      className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                        isFull
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      {isFull ? 'Full' : 'Join'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Activity Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Activity</h3>
            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Type
                </label>
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as 'lunch' | 'after-work' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="lunch">Lunch</option>
                  <option value="after-work">After Work</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="e.g., Pizza lunch at Mario's"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Add some details..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newActivity.time}
                    onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  value={newActivity.maxParticipants}
                  onChange={(e) => setNewActivity({ ...newActivity, maxParticipants: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  min="2"
                  max="50"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

