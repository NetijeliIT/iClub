import { useState, useEffect } from "react";
import CategoryCarousel from "../components/Category";
import MealCard from "../components/MealCard";
import { useQuery } from "@tanstack/react-query";
import { getCategory, getCategoryById } from "../services/apiCategory";
import { MealType } from "../types";

const HomePage = () => {
    const {
        data: categories = {},
        isLoading: isCategoriesLoading,
        error: categoriesError,
    } = useQuery({
        queryKey: ["category"],
        queryFn: getCategory,
    });

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    useEffect(() => {
        if (categories?.response?.length > 0 && selectedCategoryId === null) {
            setSelectedCategoryId(categories.response[0].id);
        }
    }, [categories, selectedCategoryId]);

    const {
        data: meals = {},
        isLoading: isMealsLoading,
        error: mealsError,
    } = useQuery({
        queryKey: ["meal", selectedCategoryId],
        queryFn: () => getCategoryById(selectedCategoryId!),
        enabled: !!selectedCategoryId,
    });

    const selectedCategory = categories?.response?.find(
        (cat: any) => cat.id === selectedCategoryId
    );

    const CategorySkeleton = () => (
        <div className="flex space-x-4 overflow-x-auto py-4">
            {[...Array(5)].map((_, index) => (
                <div
                    key={index}
                    className="w-24 h-12 bg-gray-200 rounded-lg animate-pulse"
                ></div>
            ))}
        </div>
    );

    const MealCardSkeleton = () => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="w-full h-40 bg-gray-200"></div>
            <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    );

    // Handle error states
    if (categoriesError)
        return <div>Error loading categories: {categoriesError.message}</div>;
    if (mealsError) return <div>Error loading meals: {mealsError.message}</div>;

    // Handle loading state
    if (isCategoriesLoading || isMealsLoading) {
        return (
            <section>
                <CategorySkeleton />
                <div className="py-4">
                    <h2 className="text-3xl font-semibold mb-4 text-[#303030]">
                        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    </h2>
                    <div className="grid grid-cols-2 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, index) => (
                            <MealCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    console.log(meals);


    return (
        <section>
            <CategoryCarousel
                data={categories?.response}
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={setSelectedCategoryId}
            />
            <div className="py-4">
                <h2 className="_hooks_ text-3xl font-semibold mb-4 text-[#303030]">
                    {selectedCategory ? selectedCategory.title : "Meals"}
                </h2>
                <div className="grid grid-cols-2 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {meals?.response?.products?.map((meal: MealType) => (
                        <MealCard
                            key={meal.id}
                            id={meal.id}
                            name={meal.name}
                            description={meal.description}
                            image={meal.image}
                            price={meal.price}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomePage;