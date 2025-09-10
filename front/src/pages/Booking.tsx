import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Hypothetical API functions
const fetchAvailability = async (date: string) => {
  // Replace with actual API call
  const response = await fetch(`/api/availability?date=${date}`);
  if (!response.ok) throw new Error('Failed to fetch availability');
  return response.json();
};

const bookSlot = async (bookingData: BookingForm) => {
  // Replace with actual API call
  const response = await fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) throw new Error('Failed to book slot');
  return response.json();
};

interface BookingForm {
  date: string;
  lesson: string;
  area: string;
  group: string;
  department: string;
  lessonName: string;
  teacher: string;
  phone: string;
  tv: boolean;
}

const lessonSlots = ['LESSON1', 'LESSON2', 'LESSON3', 'LESSON4', 'LESSON5', 'LESSON6'];

// Define lesson pairs for TV constraint
const lessonPairs: Record<string, string> = {
  LESSON1: 'LESSON2',
  LESSON2: 'LESSON1',
  LESSON3: 'LESSON4',
  LESSON4: 'LESSON3',
  LESSON5: 'LESSON6',
  LESSON6: 'LESSON5',
};

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{ lesson: string; area: string } | null>(null);
  const [form, setForm] = useState<BookingForm>({
    date: '',
    lesson: '',
    area: '',
    group: '',
    department: '',
    lessonName: '',
    teacher: '',
    phone: '',
    tv: false,
  });

  // Fetch availability when a date is selected
  const { data: availability, refetch, isLoading, error } = useQuery({
    queryKey: ['availability', selectedDate],
    queryFn: () => fetchAvailability(selectedDate),
    enabled: !!selectedDate,
    initialData: { lessons: [] },
  });

  const mutation = useMutation({
    mutationFn: bookSlot,
    onSuccess: () => {
      toast.success('Booking successful!');
      setSelectedSlot(null);
      setForm({ date: '', lesson: '', area: '', group: '', department: '', lessonName: '', teacher: '', phone: '', tv: false });
      refetch();
    },
    onError: () => {
      toast.error('Failed to book slot');
    },
  });

  // Filter available and unavailable slots
  const availableSlots = availability?.lessons?.filter(
    (slot: { lesson: string; areas: string[]; tvBooked: boolean }) => slot.areas.length > 0
  ) || [];
  const unavailableSlots = lessonSlots.filter(
    (lesson) => !availability?.lessons?.some((slot: { lesson: string }) => slot.lesson === lesson)
  );

  // Check if TV is available for the selected lesson
  const isTvAvailable = (lesson: string) => {
    const pairedLesson = lessonPairs[lesson];
    if (!pairedLesson) return true; // No paired lesson, TV is available
    const pairedSlot = availability?.lessons?.find((slot: { lesson: string }) => slot.lesson === pairedLesson);
    return !pairedSlot?.tvBooked; // TV is available if paired lesson doesn't have tvBooked: true
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(null);
    setForm({ ...form, date: e.target.value, lesson: '', area: '', tv: false });
  };

  const handleSlotSelect = (lesson: string, area: string) => {
    setSelectedSlot({ lesson, area });
    setForm({ ...form, lesson, area, tv: false });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div style={{gridColumn:"2/3"}} className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Date Selection */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📅 Select Date</h2>
        <div>
          <label className="text-sm text-gray-600">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>
      </div>

      {/* Availability Section */}
      {selectedDate && (
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Slots for {selectedDate}</h2>
          {isLoading && <p>Loading availability...</p>}
          {error && <p className="text-red-600">Error loading availability 😢</p>}
          {!isLoading && !error && availableSlots.length === 0 && unavailableSlots.length === 0 && (
            <p className="text-gray-600">No slots available for this date.</p>
          )}

          {/* Available Slots */}
          {availableSlots.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Slots</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableSlots.map((slot: { lesson: string; areas: string[]; tvBooked: boolean }) => (
                  <div key={slot.lesson} className="bg-gray-50 border rounded-lg p-3 shadow-sm">
                    <span className="block text-sm font-medium mb-2">🕒 {slot.lesson}</span>
                    {slot.areas.map((area: string) => (
                      <div key={area} className="flex justify-between text-sm items-center mb-2">
                        <span>{area}:</span>
                        <button
                          type="button"
                          onClick={() => handleSlotSelect(slot.lesson, area)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                            selectedSlot?.lesson === slot.lesson && selectedSlot?.area === area
                              ? 'bg-blue-600 text-white'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          disabled={mutation.isPending}
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                          <span>Select</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unavailable Slots */}
          {unavailableSlots.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Unavailable Slots</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {unavailableSlots.map((lesson) => (
                  <div key={lesson} className="bg-gray-50 border rounded-lg p-3 shadow-sm">
                    <span className="block text-sm font-medium mb-2">🕒 {lesson}</span>
                    <div className="flex justify-between text-sm items-center">
                      <span>All Areas:</span>
                      <div className="flex items-center gap-1 text-red-600">
                        <XCircleIcon className="w-5 h-5" />
                        <span>Booked</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Booking Form */}
      {selectedSlot && (
        <div className="bg-white shadow-lg rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📅 Book Slot: {form.date} - {form.lesson} ({form.area})
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Group Number</label>
              <input
                name="group"
                value={form.group}
                onChange={handleFormChange}
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Department</label>
              <input
                name="department"
                value={form.department}
                onChange={handleFormChange}
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Lesson</label>
              <input
                name="lessonName"
                value={form.lessonName}
                onChange={handleFormChange}
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Teacher</label>
              <input
                name="teacher"
                value={form.teacher}
                onChange={handleFormChange}
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleFormChange}
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Need TV?</label>
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
                <span className="text-red-600 text-sm">TV booked for {lessonPairs[form.lesson]}</span>
              )}
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Booking;