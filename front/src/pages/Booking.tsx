import { useState } from 'react';
import { CheckCircleIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../components/Modal'; // Import the Modal component
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
  group: string;
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

const Booking = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [form, setForm] = useState<BookingForm>({
    date: today,
    lesson: '',
    area: 'Default Area',
    tv: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupInput, setGroupInput] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{ lesson: string; tv: boolean } | null>(null);

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
    mutationFn: ({ lesson, tv, group }: { lesson: string; tv: boolean; group: string }) =>
      createBooking({ bookingDate: selectedDate, details: { lesson, tv, group } }),
    onSuccess: () => {
      toast.success('Slot booked successfully!', { duration: 4000 });
      refetch();
      setForm({ date: today, lesson: '', area: 'Default Area', tv: false });
      setIsModalOpen(false);
      setGroupInput('');
      setSelectedSlot(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to book slot', { duration: 4000 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ lesson, tv, group }: { lesson: string; tv: boolean; group: string }) =>
      updateBooking({ id: bookings!.id, lesson, tv, group }),
    onSuccess: () => {
      toast.success('Booking updated successfully!', { duration: 4000 });
      refetch();
      setForm({ date: today, lesson: '', area: 'Default Area', tv: false });
      setIsModalOpen(false);
      setGroupInput('');
      setSelectedSlot(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update booking', { duration: 4000 });
    },
  });

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
    setSelectedSlot({ lesson, tv });
    setIsModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!groupInput.trim()) {
      toast.error('Please enter a group name', { duration: 4000 });
      return;
    }
    if (selectedSlot) {
      if (bookings?.id) {
        updateMutation.mutate({ ...selectedSlot, group: groupInput });
      } else {
        createMutation.mutate({ ...selectedSlot, group: groupInput });
      }
    }
  };

  return (
    <div style={{ gridColumn: '2/3' }} className="max-w-7xl mx-auto py-6 space-y-8 bg-gray-50 min-h-screen">
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
        <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-indigo-600" />
            Slots for {selectedDate}
          </h2>
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="ml-2 text-gray-600">Loading slots...</p>
            </div>
          )}
          {error && <p className="text-red-600 font-medium">Error loading slots: {error.message}</p>}
          {!isLoading && !error && lessonSlots.length > 0 && (
            <div className="space-y-6">
              {lessonSlots.map((lesson) => {
                const lessonAvailableSlots = availableSlots.filter((slot) => slot.lesson === lesson);
                const lessonBookedSlots = bookedSlots.filter((slot) => slot.lesson === lesson);
                const hasSlots = lessonAvailableSlots.length > 0 || lessonBookedSlots.length > 0;

                return (
                  <div key={lesson} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">{lessonNames[lesson]}</h3>
                    {!hasSlots && (
                      <p className="text-gray-500 italic">No slots available or booked for this lesson.</p>
                    )}
                    {hasSlots && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[{ tv: false }, { tv: true }].map(({ tv }) => {
                          const isAvailable = lessonAvailableSlots.some((slot) => slot.tv === tv);
                          const isBooked = lessonBookedSlots.some((slot) => slot.tv === tv);
                          const slot = lessonBookedSlots.find((slot) => slot.tv === tv);

                          if (isAvailable) {
                            return (
                              <div
                                key={`${lesson}-${tv}`}
                                className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                <span className="block text-sm font-semibold text-green-800 mb-2">
                                  🕒 {lessonNames[lesson]} {tv ? '(with TV)' : '(without TV)'} - Available
                                </span>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Area: Default Area</span>
                                  <button
                                    type="button"
                                    onClick={() => handleSlotSelect(lesson, tv)}
                                    className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-all duration-200 font-medium flex items-center gap-2"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                  >
                                    <CheckCircleIcon className="w-5 h-5" />
                                    Book
                                  </button>
                                </div>
                              </div>
                            );
                          }
                          if (isBooked && slot) {
                            return (
                              <div
                                key={`${lesson}-${tv}`}
                                className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm transition-all duration-200"
                              >
                                <span className="block text-sm font-semibold text-red-800 mb-2">
                                  🕒 {lessonNames[lesson]} {tv ? '(with TV)' : '(without TV)'} - Booked
                                </span>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="block text-sm text-gray-600">
                                      Booked by: {slot.user.firstName || 'Unknown'} {slot.user.secondName || ''} {slot.user.isTeacher ? '(Teacher)' : '(Student)'}
                                    </span>
                                    <span className="block text-sm text-gray-600">
                                      Group: {slot.group || 'None'}
                                    </span>
                                    <span className="block text-sm text-gray-500">
                                      Booked on: {new Date(slot.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {!isLoading && !error && lessonSlots.length === 0 && (
            <p className="text-gray-500 italic">No lessons configured.</p>
          )}
        </div>
      )}

      {/* Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setGroupInput('');
          setSelectedSlot(null);
        }}
        title="Book Slot"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Booking: {selectedSlot ? `${lessonNames[selectedSlot.lesson]} ${selectedSlot.tv ? '(with TV)' : '(without TV)'}` : ''} on {selectedDate}
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
            <input
              type="text"
              value={groupInput}
              onChange={(e) => setGroupInput(e.target.value)}
              placeholder="Enter group name"
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 text-gray-900"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setGroupInput('');
                setSelectedSlot(null);
              }}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmBooking}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 font-medium flex items-center gap-2"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <CheckCircleIcon className="w-5 h-5" />
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Booking;