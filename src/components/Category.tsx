const CategoryCarousel = () => {
    const categories = ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Drinks'];

    return (
        <div className="py-4 max-w-7xl mx-auto">
            <div className="flex space-x-2 overflow-x-auto hide-scroll scroll-auto px-2">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className={`${index === 0 ? "active" : ""} transition-all duration-150 hover:bg-[#D4AF37] hover:text-white py-2 px-6 rounded-4xl text-center text-gray-600 font-medium border border-gray-300 [&.active]:bg-[#D4AF37] [&.active]:text-white`}
                    >
                        {category}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryCarousel;