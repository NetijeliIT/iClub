import { useDispatch, useSelector } from "react-redux";
import { MealType, MealWithCount } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { placeOrder } from "../services/apiOrder";
import toast from "react-hot-toast";
import { emptyCard } from "../redux/card-slice";
import { useNavigate } from "react-router";
import { useState } from "react";

const CartPage = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const meals = useSelector((state: any) => state.card.meals);
    const [description, setDescription] = useState<string>();

    const calculateTotalCost = (meals: MealWithCount[]): number => {
        let totalCost = 0;
        meals.forEach(meal => {
            totalCost += meal.count * meal.price;
        });
        return totalCost;
    };
    let totalCost = calculateTotalCost(meals);

    const mutation = useMutation({
        mutationFn: (data: { orderItems: MealWithCount[] }) => placeOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order'] });
            toast.success("Success!");
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });

    async function handleOrder() {
        let data = { orderItems: [], description: "" };
        data.description = description as string || '';
        data.orderItems = meals.map((el: MealWithCount) => {
            return {
                productId: el.id,
                quantity: el.count,
                price: el.count * el.price
            };
        });
        mutation.mutate(data);
        dispatch(emptyCard());
        navigate('/profile/orders');
    }

    return (
        <section>
            <div className="flex justify-center py-4 sm:py-6 md:py-8">
                <div className="w-full">

                    {meals.length === 0 ? (
                        <div className="text-center text-xl sm:text-2xl md:text-3xl text-gray-800 flex flex-col items-center mt-4" style={{ fontFamily: 'Caveat, cursive' }}>
                            <svg className="w-50 h-50 fill-[#D4AF37]" xmlns="http://www.w3.org/2000/svg" version="1.0" width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
                                    <path d="M493 4795 c-61 -31 -98 -80 -114 -152 -21 -92 14 -193 85 -241 17 -11 111 -49 208 -83 115 -40 179 -68 182 -78 3 -9 89 -455 191 -991 102 -536 201 -1034 220 -1107 118 -452 334 -748 635 -870 132 -53 127 -53 1080 -53 l886 0 44 23 c146 73 152 318 10 402 -34 20 -51 20 -910 25 l-875 5 -60 23 c-121 46 -197 113 -265 234 l-32 58 1089 0 c1250 0 1158 -7 1253 88 34 34 69 83 88 122 18 37 138 429 282 920 236 803 251 859 246 913 -8 77 -36 138 -78 170 -77 59 -4 57 -1749 57 l-1597 0 -46 143 c-49 153 -84 215 -137 243 -39 20 -539 174 -566 174 -10 0 -42 -11 -70 -25z m1920 -1231 c99 -65 113 -200 28 -285 -117 -118 -316 -34 -314 132 2 148 161 234 286 153z m1020 25 c50 -14 113 -71 128 -116 27 -83 -9 -182 -81 -221 -77 -43 -152 -36 -217 21 -107 94 -73 264 63 312 48 17 59 18 107 4z m-373 -529 c209 -51 498 -239 530 -347 11 -36 10 -46 -6 -79 -22 -45 -75 -84 -113 -84 -35 0 -77 24 -154 90 -87 74 -176 125 -272 157 -112 37 -277 39 -379 5 -123 -41 -208 -91 -312 -182 -31 -28 -72 -54 -90 -59 -103 -29 -194 80 -148 176 23 45 165 163 272 224 90 52 243 105 337 118 95 13 232 5 335 -19z" />
                                    <path d="M2173 959 c-143 -55 -241 -225 -214 -371 13 -73 26 -104 67 -159 43 -59 110 -102 192 -125 155 -43 322 39 394 193 38 81 41 179 7 268 -30 81 -112 163 -192 193 -75 29 -181 29 -254 1z" />
                                    <path d="M3553 959 c-111 -43 -203 -163 -218 -284 -21 -165 107 -341 273 -376 148 -30 309 48 379 185 39 74 44 198 12 281 -30 81 -112 164 -192 193 -75 29 -181 29 -254 1z" />
                                </g>
                            </svg>
                            <p className="mt-4">Cart is empty</p>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6 sm:mb-8 text-center flex items-center justify-center gap-2" style={{ fontFamily: 'Caveat, cursive' }}>

                                Cafe Receipt
                            </h1>
                            <div className="pt-4 sm:pt-6" style={{ fontFamily: 'Caveat, cursive' }}>
                                {meals.map((el: MealType & { count: number }) => (
                                    <div key={el.id} className="flex justify-between text-xl sm:text-2xl md:text-3xl text-gray-800 mb-3 sm:mb-4">
                                        <span>{el.name}</span>
                                        <span>{el.price} x {el.count} | {el.price * el.count} TMT</span>
                                    </div>
                                ))}
                                <div className="border-t-2 border-gray-400 my-4 sm:my-6"></div>
                                <div className="flex justify-between text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                    <span>Total</span>
                                    <span>{totalCost} TMT</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {meals.length > 0 && (
                <>
                    <div className="my-4 sm:my-6 md:my-8">
                        <h4 className="text-lg text-gray-700 font-medium">Sagady yazyn we basga name isleseniz:</h4>
                        <div className="border border-[#D4AF37] rounded">
                            <textarea rows={6} className="w-full h-full focus:outline-none p-2"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Sagady yazyn"></textarea>
                        </div>
                    </div>
                    <button
                        onClick={handleOrder}
                        className="bg-[#D4AF37] text-white text-lg font-medium p-2 px-6 rounded float-right cursor-pointer hover:opacity-90 transition-all duration-150"
                    >
                        Zakaz et
                    </button>
                </>
            )}
        </section>
    );
};

export default CartPage;