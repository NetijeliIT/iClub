import { CategoryType } from "../types";

type Props = {
    data: CategoryType[];
    selectedCategoryId: string | null;
    onCategorySelect: (id: string) => void;
};

const CategoryCarousel = ({ data, selectedCategoryId, onCategorySelect }: Props) => {
    return (
        <div className="py-4 max-w-7xl mx-auto">
            <div className="flex space-x-2 overflow-x-auto hide-scroll scroll-auto px-2">
                {data?.map((category: CategoryType) => (
                    <button
                        key={category.id}
                        onClick={() => onCategorySelect(category.id as string)}
                        className={`${category.id === selectedCategoryId ? "active" : ""
                            } transition-all duration-150 hover:bg-[#D4AF37] hover:text-white py-2 px-6 rounded-4xl text-center text-gray-600 font-medium border border-gray-300 [&.active]:bg-[#D4AF37] [&.active]:text-white`}
                    >
                        {category.title}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryCarousel;