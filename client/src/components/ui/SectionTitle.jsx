const SectionTitle = ({ text }) => {
  return (
    <div className="flex flex-col justify-center text-center py-10 px-4">
      <h1
        className="
          font-bold 
          uppercase 
          font-highlight 
          text-[clamp(1.5rem,5vw,3rem)] 
          max-w-[250px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] 
          mx-auto 
          mb-2
        "
      >
        {text}
      </h1>

      <div className="flex items-center w-full justify-center">
        <hr className="w-[100px] border-1 border-primary" />
        <img src="/star.svg" className="w-10 h-10 mx-2" />
        <hr className="w-[100px] border-1 border-primary" />
      </div>
    </div>
  );
};

export default SectionTitle;

