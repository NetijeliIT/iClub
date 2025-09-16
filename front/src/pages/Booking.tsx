import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { CheckCircleIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getBookings, createBooking, updateBooking } from '../services/apiBooking';

interface BookingForm {
  date: string;
  lesson: string;
  area: string;
  tv: boolean;
}

interface BookingResponse {
  id: string;
  bookingDate: string;
  details: { id: string; lesson: string; tv: boolean; user: any; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

// Define human-friendly names for lessons
const lessonNames: Record<string, string> = {
  LESSON1: 'Lesson 1 (without TV)',
  LESSON2: 'Lesson 2 (without TV)',
  LESSON3: 'Lesson 3 (without TV)',
  LESSON1_B: 'Lesson 1 (with TV)',
  LESSON2_B: 'Lesson 2 (with TV)',
  LESSON3_B: 'Lesson 3 (with TV)',
};

const lessonSlots = ['LESSON1', 'LESSON2', 'LESSON3', 'LESSON1_B', 'LESSON2_B', 'LESSON3_B'];

// Define lesson pairs for TV constraint (all slots are independent)
const lessonPairs: Record<string, string> = {
  LESSON1: 'LESSON1',
  LESSON2: 'LESSON2',
  LESSON3: 'LESSON3',
  LESSON1_B: 'LESSON1_B',
  LESSON2_B: 'LESSON2_B',
  LESSON3_B: 'LESSON3_B',
};

const groupLessons = (lessons: string[]) => {
  const groups: Record<string, string[]> = {};
  lessons.forEach((lesson) => {
    const base = lesson.replace('_B', '');
    if (!groups[base]) groups[base] = [];
    groups[base].push(lesson);
  });
  return groups;
};

const Booking = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState<{ lesson: string; area: string } | null>(null);
  const [form, setForm] = useState<BookingForm>({
    date: today,
    lesson: '',
    area: '',
    tv: false,
  });
  const [existingBooking, setExistingBooking] = useState<BookingResponse | null>(null);

  // Fetch bookings for selected date via POST
  const { data: bookings, refetch, isLoading, error } = useQuery({
    queryKey: ['bookings', selectedDate],
    queryFn: async () => {
      try {
        return await getBookings(selectedDate);
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

  // Set existing booking when data changes
  useEffect(() => {
    setExistingBooking(bookings);
  }, [bookings]);

  // Mutation for creating a booking (immediate booking)
  const createMutation = useMutation({
    mutationFn: ({ lesson, tv }: { lesson: string; tv: boolean }) =>
      createBooking({ bookingDate: selectedDate, details: { lesson, tv } }),
    onSuccess: () => {
      toast.success('Slot booked successfully!');
      refetch();
    },
    onError: () => {
      toast.error('Failed to book slot');
    },
  });

  // Mutation for updating a booking (form-based)
  const updateMutation = useMutation({
    mutationFn: (data: BookingForm) =>
      updateBooking({ id: existingBooking!.id, lesson: data.lesson, tv: data.tv }),
    onSuccess: () => {
      toast.success('Booking updated successfully!');
      setSelectedSlot(null);
      setForm({ date: today, lesson: '', area: '', tv: false });
      refetch();
    },
    onError: () => {
      toast.error('Failed to update booking');
    },
  });

  // Filter available slots
  const availableSlots = lessonSlots.filter(
    (lesson) => !bookings?.details?.some((slot: { lesson: string }) => slot.lesson === lesson)
  );

  // Check if TV is available for the selected lesson
  const isTvAvailable = (lesson: string) => {
    const pairedLesson = lessonPairs[lesson];
    return pairedLesson === lesson; // All slots are independent
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setSelectedSlot(null);
    setForm({ ...form, date: newDate, lesson: '', area: '', tv: false });
  };

  const handleSlotSelect = (lesson: string) => {
    // Immediately book the slot with TV off
    createMutation.mutate({ lesson, tv: lesson.includes('_B') });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  return (
    <div style={{gridColumn:"2/3"}} className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Date Selection */}
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          Select Date
        </h2>
        <div>
          <label className="text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full border border-gray-300 rounded-lg p-3 mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
      </div>

      {/* Availability */}
      {selectedDate && (
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Slots for {selectedDate}</h2>
          {isLoading && <p className="text-gray-600">Loading availability...</p>}
          {error && <p className="text-red-600 font-medium">Error loading availability 😢</p>}
          {!isLoading && !error && availableSlots.length === 0 && (
            <p className="text-gray-600 italic">No slots available for this date.</p>
          )}

          {/* Available Slots */}
          {availableSlots.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Slots</h3>
              {Object.entries(groupLessons(availableSlots)).map(([base, group]) => (
                <div key={base} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {group.map((lesson) => (
                    <div
                      key={lesson}
                      className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                    >
                      <span className="block text-sm font-semibold text-green-800 mb-3">🕒 {lessonNames[lesson]}</span>
                      <div className="flex justify-between text-sm items-center mb-3">
                        <span className="text-gray-700">Area: Default Area</span>
                        <button
                          type="button"
                          onClick={() => handleSlotSelect(lesson)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition disabled:opacity-50"
                          disabled={createMutation.isPending || updateMutation.isPending}
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                          <span>Book</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Update Form */}
      {selectedSlot && (
        <div className="bg-white shadow-xl rounded-2xl p-8 lg:col-span-2 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📅 Update Slot: {form.date} - {lessonNames[form.lesson]} ({form.area})
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Need TV?</label>
              <Switch
                checked={form.tv}
                onChange={(val) => setForm({ ...form, tv: val })}
                className={`${form.tv ? 'bg-blue-600' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
                disabled={!isTvAvailable(form.lesson)}
              >
                <span className="sr-only">Enable TV</span>
                <span
                  className={`${form.tv ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
              {!isTvAvailable(form.lesson) && (
                <span className="text-red-600 text-sm font-medium">TV booked for {lessonNames[lessonPairs[form.lesson]]}</span>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Booking'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Booking;