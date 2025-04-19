import { PhoneIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";

const ProfilePage = () => {
    return (
        <div>
            <div className="mt-4">
                <label className="text-lg text-gray-700 font-medium" htmlFor="name">Name:</label>
                <div className="border flex gap-2 items-center border-gray-700 rounded-xl overflow-hidden">
                    <span className="bg-gray-200  px-2 py-2 border-r border-gray-800"><UserIcon className="w-5 h-5" /></span>
                    <input disabled className="w-full p-1 focus:outline-none text-lg font-medium  cursor-not-allowed text-gray-600" id="name" type="text" defaultValue={"Dawut"} />
                </div>
            </div>
            <div className="mt-2">
                <label className="text-lg text-gray-700 font-medium" htmlFor="name">Surname:</label>
                <div className="border flex gap-2 items-center border-gray-700 rounded-xl overflow-hidden">
                    <span className="bg-gray-200  px-2 py-2 border-r border-gray-800"><UserIcon className="w-5 h-5" /></span>
                    <input disabled className="w-full p-1 focus:outline-none text-lg font-medium  cursor-not-allowed text-gray-600" id="name" type="text" defaultValue={"Akyyew"} />
                </div>
            </div>
            <div className="mt-2">
                <label className="text-lg text-gray-700 font-medium" htmlFor="name">Phone:</label>
                <div className="border flex gap-2 items-center border-gray-700 rounded-xl overflow-hidden">
                    <span className="bg-gray-200  px-2 py-2 border-r border-gray-800"><PhoneIcon className="w-5 h-5" /></span>
                    <input disabled className="w-full p-1 focus:outline-none text-lg font-medium  cursor-not-allowed text-gray-600" id="name" type="text" defaultValue={"+99362430387"} />
                </div>
            </div>
            <button className="bg-[#D4AF37] text-white text-lg font-medium p-2 px-6 rounded float-right mt-4 cursor-pointer hover:opacity-90 transition-all duration-150">
                Log out
            </button>
        </div>
    );
};

export default ProfilePage;