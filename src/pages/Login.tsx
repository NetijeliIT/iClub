
const LoginPage = () => {
  return (
    <div
      className="h-[100dvh] w-full bg-cover sm:background-fill bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: "url('/back4.jpg')",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full  absolute bottom-0 sm:static sm:rounded-3xl sm:max-w-[400px] px-6 py-10 bg-white/80 backdrop-blur-md rounded-t-3xl shadow-xl">
        <div className="flex flex-col items-center mb-6">
          {/* <img src="/logo.png" alt="Cafe Logo" className="w-20 h-20 mb-2" /> */}
          <h1 className="text-3xl font-bold text-[#393939]">iClub</h1>
          <p className="text-base text-gray-600">Your daily campus cafe</p>
        </div>
        <form className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
          />
          <button
            type="submit"
            className="w-full bg-[#d4af37] text-white py-3 rounded-xl text-base font-semibold tracking-wide shadow-md hover:bg-[#c09c2f] transition-all"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-5">
          Don’t have an account? <a href="#" className="text-[#d4af37] font-semibold">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
