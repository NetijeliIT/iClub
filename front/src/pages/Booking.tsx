import { useState } from 'react';
import { CheckCircleIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/solid';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getBookings, createBooking, updateBooking } from '../services/apiBooking';

interface BookingForm {
  date: string;
  lesson: string;
  area: string;
  tv: boolean;
}

interface User {
  id: string;
  firstName: string;
  secondName: string;
  studentId: string;
  department: string;
  isTeacher: boolean;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingDetail {
  id: string;
  lesson: string;
  tv: boolean;
  user: User;
  createdAt: string;
  updatedAt: string;
}

interface BookingResponse {
  id: string;
  bookingDate: string;
  details: BookingDetail[];
  createdAt: string;
  updatedAt: string;
}

const lessonNames: Record<string, string> = {
  LESSON1: 'Lesson 1',
  LESSON2: 'Lesson 2',
  LESSON3: 'Lesson 3',
};

const lessonSlots = ['LESSON1', 'LESSON2', 'LESSON3'];

const groupLessons = (lessons: string[]) => {
  const groups: Record<string, string[]> = {};
  lessons.forEach((lesson) => {
    if (!groups[lesson]) groups[lesson] = [];
    groups[lesson].push(lesson);
  });
  return groups;
};

const Booking = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [form, setForm] = useState<BookingForm>({
    date: today,
    lesson: '',
    area: 'Default Area',
    tv: false,
  });

  const { data: bookings, refetch, isLoading, error } = useQuery({
    queryKey: ['bookings', selectedDate],
    queryFn: async () => {
      try {
        const response = await getBookings(selectedDate);
        return response.response as BookingResponse;
      } catch (err: any) {
        if (err.response?.status === 404) {
          return { id: '', bookingDate: selectedDate, details: [], createdAt: '', updatedAt: '' } as BookingResponse;
        }
        throw err;
      }
    },
    enabled: !!selectedDate,
    initialData: { id: '', bookingDate: selectedDate, details: [], createdAt: '', updatedAt: '' } as BookingResponse,
  });

  const createMutation = useMutation({
    mutationFn: ({ lesson, tv }: { lesson: string; tv: boolean }) =>
      createBooking({ bookingDate: selectedDate, details: { lesson, tv } }),
    onSuccess: () => {
      toast.success('Slot booked successfully!', { duration: 4000 });
      refetch();
      setForm({ date: today, lesson: '', area: 'Default Area', tv: false });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to book slot', { duration: 4000 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ lesson, tv }: { lesson: string; tv: boolean }) =>
      updateBooking({ id: bookings!.id, lesson, tv }),
    onSuccess: () => {
      toast.success('Booking updated successfully!', { duration: 4000 });
      refetch();
      setForm({ date: today, lesson: '', area: 'Default Area', tv: false });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update booking', { duration: 4000 });
    },
  });

  // Determine available slots for each lesson and TV combination
  const getAvailableSlots = () => {
    const available: { lesson: string; tv: boolean }[] = [];
    lessonSlots.forEach((lesson) => {
      const isNonTvBooked = bookings?.details.some((slot) => slot.lesson === lesson && !slot.tv);
      const isTvBooked = bookings?.details.some((slot) => slot.lesson === lesson && slot.tv);
      if (!isNonTvBooked) available.push({ lesson, tv: false });
      if (!isTvBooked) available.push({ lesson, tv: true });
    });
    return available;
  };

  const availableSlots = getAvailableSlots();
  const bookedSlots = bookings?.details || [];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setForm({ ...form, date: newDate, lesson: '', area: 'Default Area', tv: false });
  };

  const handleSlotSelect = (lesson: string, tv: boolean) => {
    if (bookings?.id) {
      updateMutation.mutate({ lesson, tv });
    } else {
      createMutation.mutate({ lesson, tv });
    }
  };

  return (
    <div style={{gridColumn:"2/3"}} className="max-w-7xl mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Date Selection */}
      <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <CalendarIcon className="w-7 h-7 text-indigo-600" />
          Select Booking Date
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={today}
            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 text-gray-900"
            required
          />
        </div>
      </div>

      {/* Slots Section */}
      {selectedDate && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booked Slots */}
          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <UserIcon className="w-6 h-6 text-red-600" />
              Booked Slots
            </h2>
            {isLoading && (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-2 text-gray-600">Loading booked slots...</p>
              </div>
            )}
            {error && <p className="text-red-600 font-medium">Error loading booked slots: {error.message}</p>}
            {bookedSlots.length === 0 && !isLoading && !error && (
              <p className="text-gray-500 italic">No slots booked for {selectedDate}.</p>
            )}
            {bookedSlots.length > 0 && (
              <div className="space-y-4">
                {bookedSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block text-sm font-semibold text-red-800">
                          🕒 {lessonNames[slot.lesson]} {slot.tv ? '(with TV)' : '(without TV)'}
                        </span>
                        <span className="block text-sm text-gray-600">
                          Booked by: {slot.user.firstName || 'Unknown'} {slot.user.secondName || ''} {slot.user.isTeacher ? '(Teacher)' : '(Student)'}
                        </span>
                        <span className="block text-sm text-gray-500">
                          Booked on: {new Date(slot.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Slots */}
          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-green-600" />
              Available Slots for {selectedDate}
            </h2>
            {isLoading && (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-2 text-gray-600">Loading availability...</p>
              </div>
            )}
            {error && <p className="text-red-600 font-medium">Error loading availability: {error.message}</p>}
            {!isLoading && !error && availableSlots.length === 0 && (
              <p className="text-gray-500 italic">No slots available for this date.</p>
            )}
            {availableSlots.length > 0 && (
              <div className="space-y-6">
                {Object.entries(groupLessons(lessonSlots)).map(([base]) => (
                  <div key={base} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">{lessonNames[base]}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {availableSlots
                        .filter((slot) => slot.lesson === base)
                        .map((slot) => (
                          <div
                            key={`${slot.lesson}-${slot.tv}`}
                            className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <span className="block text-sm font-semibold text-green-800 mb-2">
                              🕒 {lessonNames[slot.lesson]} {slot.tv ? '(with TV)' : '(without TV)'}
                            </span>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Area: Default Area</span>
                              <button
                                type="button"
                                onClick={() => handleSlotSelect(slot.lesson, slot.tv)}
                                className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-all duration-200 font-medium flex items-center gap-2"
                                disabled={createMutation.isPending || updateMutation.isPending}
                              >
                                <CheckCircleIcon className="w-5 h-5" />
                                Book
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;