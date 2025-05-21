import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const Booking = () => {
    const [form, setForm] = useState({
        date: '',
        lesson: '',
        group: '',
        department: '',
        lessonName: '',
        teacher: '',
        phone: '',
        tv: false,
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log('Form submitted:', form);
    };

    const isBooked = (lesson: string, area: number) => {
        if (lesson === 'lesson1') return area === 1;
        if (lesson === 'lesson2') return true;
        return false;
    };

    return (
        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ gridColumn: "2/3" }}>
            <div className="bg-white shadow-lg rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📅 Book the University Cafe</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-600">Date</label>
                        <input type="date" name="date" onChange={handleChange} className="w-full border rounded-lg p-2" required />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Lesson Time</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {["lesson1", "lesson2", "lesson3"].map((l) => (
                                <button
                                    type="button"
                                    key={l}
                                    onClick={() => setForm({ ...form, lesson: l })}
                                    className={`px-3 py-2 rounded-lg text-sm transition ${form.lesson === l ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Group Number</label>
                        <input name="group" onChange={handleChange} className="w-full border rounded-lg p-2" required />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Department</label>
                        <input name="department" onChange={handleChange} className="w-full border rounded-lg p-2" required />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Lesson</label>
                        <input name="lessonName" onChange={handleChange} className="w-full border rounded-lg p-2" required />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Teacher</label>
                        <input name="teacher" onChange={handleChange} className="w-full border rounded-lg p-2" required />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Phone Number</label>
                        <input type="tel" name="phone" onChange={handleChange} className="w-full border rounded-lg p-2" required />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Need TV?</label>
                        <Switch
                            checked={form.tv}
                            onChange={(val) => setForm({ ...form, tv: val })}
                            className={`${form.tv ? 'bg-blue-600' : 'bg-gray-300'
                                } relative inline-flex h-6 w-11 items-center rounded-full transition`}
                        >
                            <span className="sr-only">Enable TV</span>
                            <span
                                className={`${form.tv ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
                            />
                        </Switch>
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Submit Booking
                        </button>
                    </div>
                </form>
            </div>

            {/* Availability Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">📋 Today & Next 3 Days</h2>
                {[...Array(4)].map((_, i) => {
                    const date = new Date(Date.now() + i * 86400000);
                    return (
                        <div key={i} className="bg-gray-50 p-4 rounded-xl shadow">
                            <h3 className="font-semibold text-gray-800">📅 {date.toDateString()}</h3>
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {["lesson1", "lesson2", "lesson3"].map((lesson, idx) => (
                                    <div key={idx} className="bg-white border rounded-lg p-3 shadow-sm">
                                        <span className="block text-sm font-medium mb-2">🕒 {lesson.toUpperCase()}</span>

                                        {/* Area 1 */}
                                        <div className="flex justify-between text-sm items-center">
                                            <span>Area 1:</span>
                                            {isBooked(lesson, 1) ? (
                                                <div className="flex items-center gap-1 text-red-600">
                                                    <XCircleIcon className="w-5 h-5" />
                                                    <span>Booked</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                    <span>Available</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Area 2 */}
                                        <div className="flex justify-between text-sm items-center">
                                            <span>Area 2:</span>
                                            {isBooked(lesson, 2) ? (
                                                <div className="flex items-center gap-1 text-red-600">
                                                    <XCircleIcon className="w-5 h-5" />
                                                    <span>Booked</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                    <span>Available</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Booking;
