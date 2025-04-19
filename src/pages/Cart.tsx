import { useSelector } from "react-redux";
import { MealType, MealWithCount } from "../types";

const CartPage = () => {
    const meals = useSelector((state: any) => state.card.meals);
    const calculateTotalCost = (meals: MealWithCount[]): number => {
        let totalCost = 0;

        meals.forEach(meal => {
            totalCost += meal.count * meal.price;
        });

        return totalCost;
    };
    let totalCost = calculateTotalCost(meals)


    return (
        <section>

            <div className=" flex justify-center py-4 sm:py-6 md:py-8">
                <div className=" w-full">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6 sm:mb-8 text-center" style={{ fontFamily: 'Caveat, cursive' }}>
                        Cafe Receipt
                    </h1>
                    <div className="pt-4 sm:pt-6" style={{ fontFamily: 'Caveat, cursive' }}>
                        {meals.map((el: MealType & { count: number }) => {
                            return <div key={el.id} className="flex justify-between text-xl sm:text-2xl md:text-3xl text-gray-800 mb-3 sm:mb-4">
                                <span>{el.name}</span>
                                <span> {el.price} x {el.count} | {el.price * el.count} TMT</span>
                            </div>
                        })}
                        <div className="border-t-2 border-gray-400 my-4 sm:my-6"></div>
                        <div className="flex justify-between text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            <span>Total</span>
                            <span>{totalCost} TMT</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-4 sm:my-6 md:my-8 ">
                <h4 className="text-lg text-gray-700 font-medium">Sagady yazyn we basga name isleseniz:</h4>
                <div className="border border-[#D4AF37] rounded">
                    <textarea rows={6} className="w-full h-full focus:outline-none p-2" placeholder="Sagady yazyn">
                    </textarea>
                </div>
            </div>
            <button className="bg-[#D4AF37] text-white text-lg font-medium p-2 px-6 rounded float-right cursor-pointer hover:opacity-90 transition-all duration-150">
                Zakaz et
            </button>
        </section>
    );
};

export default CartPage;