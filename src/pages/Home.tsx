import CategoryCarousel from "../components/Category";
import MealCard from "../components/MealCard";

const HomePage = ({ }) => {
    const meals = [
        {
            id: 1,
            name: 'Toast',
            description: 'Fluffy pancakes with syrup',
            price: 10,
            image: '/tost.jpg',
        },
        {
            id: 2,
            name: 'Sandwich',
            description: 'Juicy beef burger with fries',
            price: 15,
            image: '/sandwich.jpg',
        },
        {
            id: 3,
            name: 'Towuk Doner',
            description: 'Fresh garden salad',
            price: 15,
            image: '/towuk.webp',
        },
        {
            id: 4,
            name: 'Corek Doner',
            description: 'Fresh garden salad',
            price: 20,
            image: '/doner.jpg',
        },
        {
            id: 5,
            name: 'Cake',
            description: 'Fresh garden salad',
            price: 10,
            image: '/cake.jpg',
        },
    ];

    return (
        <section>
            <CategoryCarousel />
            <div className="py-4 ">
                <h2 className="text-3xl font-semibold mb-4 text-[#303030]">Breakfast</h2>
                <div className="grid grid-cols-2 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {meals.map((meal, index) => (
                        <MealCard id={meal.id} key={index} name={meal.name} desc={meal.description} image={meal.image} price={meal.price} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomePage;