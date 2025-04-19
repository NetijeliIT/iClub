import { MinusIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { MealType } from "../types";
import { addToCard, decrementCount, incrementCount } from "../redux/card-slice";


const MealCard = ({ name, desc, image, price, id }: MealType) => {
    const dispatch = useDispatch();
    const meals = useSelector((state: any) => state.card);
    let currentMeal = meals.meals.find((meal: any) => meal?.id === id)


    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all">
            <div className="h-40  bg-gray-100">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="py-2 px-3">
                <div className="">
                    <h4 className="text-xl text-[#393939] font-semibold">{name}</h4>
                    <p className="text-lg text-[#D4AF37] font-semibold">{price} TMT</p>
                </div>
                <p className="text-sm font-medium text-gray-500">{desc}</p>
                {!currentMeal ?
                    <button className="w-full text-sm sm:text-base mt-2 mb-2 flex items-center justify-center gap-2 font-semibold py-2 rounded-2xl border border-[#D4AF37] transition text-[#D4AF37] cursor-pointer hover:bg-[#D4AF37] hover:text-white"
                        onClick={() => {
                            dispatch(addToCard({ name, image, desc, price, id }))
                        }}
                    >
                        <ShoppingCartIcon className="w-6 h-6" /> Add to Card
                    </button>
                    :

                    <div className="flex mt-2 gap-5 justify-center items-center">
                        <button
                            onClick={() => {
                                dispatch(decrementCount(id))
                            }}
                            className="border border-gray-300 rounded-4xl text-gray-600 p-1 cursor-pointer hover:bg-gray-100 transition-all duration-150"><MinusIcon className="w-5 h-5" /></button>
                        <p className="text-lg text-gray-600">{currentMeal?.count}</p>
                        <button
                            onClick={() => {
                                dispatch(incrementCount(id))
                            }}
                            className="border border-gray-300 rounded-4xl text-gray-600 p-1 cursor-pointer hover:bg-gray-100 transition-all duration-150"><PlusIcon className="w-5 h-5" /></button>
                    </div>

                }
            </div>
        </div>
    );
};

export default MealCard;