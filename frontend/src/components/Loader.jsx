import HashLoader from "react-spinners/HashLoader";

const Loader = () => {

  return (

    <div className="flex flex-col items-center justify-center gap-4 min-h-screen bg-[#0B0B0B]">
      <HashLoader color="#00CE51" size={60} />
      <p className="text-gray-400 text-sm">
        Loading Dashboard...
      </p>
    </div>

  );

};

export default Loader;