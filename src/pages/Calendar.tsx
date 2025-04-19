
const getRandomColor = () => (Math.random() > 0.5 ? 'bg-red-500' : 'bg-green-500');

const Calendar = () => {
    const currentDate = new Date(); // Получаем сегодняшнюю дату
    const year = currentDate.getFullYear();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    const firstDay = (new Date(year, currentDate.getMonth(), 1).getDay() + 6) % 7; // Сдвигаем так, чтобы 0 = Monday
    const today = currentDate.getDate();

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Generate days with random color circles
    const days = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        circleColors: [
            getRandomColor(),
            getRandomColor(),
            getRandomColor(),
        ],
    }));

    return (
        <section className=" pb-4 mt-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                Book Cafe for Study - {month} {year}
            </h1>
            <div className="">
                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
                    {daysOfWeek.map((day, index) => (
                        <div
                            key={index}
                            className="text-gray-600 font-semibold text-xs sm:text-sm"
                        >
                            {day}
                        </div>
                    ))}
                    {Array(firstDay).fill(0).map((_, index) => (
                        <div key={`empty-${index}`} className="min-h-14"></div>
                    ))}
                    {days.map(({ day, circleColors }, index) => (
                        <div
                            key={index}
                            className={`p-2 sm:p-4 min-h-14 rounded-lg ${day === today
                                ? 'bg-[#D4AF37] text-white'
                                : 'bg-gray-50 text-gray-800'
                                } flex flex-col items-center justify-between`}
                        >
                            <span className="font-medium text-sm sm:text-base">
                                {day}
                            </span>
                            <div className="flex gap-1 mt-2">
                                {circleColors.map((color, i) => (
                                    <span
                                        key={i}
                                        className={`w-2 h-2 ${color} block rounded-full`}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <h2 className="text-gray-700 text-lg mt-8 font-semibold text-center">For booking call: +99366445500</h2>
        </section>
    );
};

export default Calendar;
