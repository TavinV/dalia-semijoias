const PHRASES = [
  "Peças banhadas a ouro 18k e prata 925",
  "Livres de níquel",
];

const Wave = ({ flip }) => (
  <svg
    className={`block w-full h-6 sm:h-8 ${flip ? "rotate-180" : ""}`}
    viewBox="0 0 1440 48"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      fill="#967965"
      d="M0,28 C180,4 360,44 540,24 C720,4 900,44 1080,24 C1260,4 1440,40 1440,40 L1440,48 L0,48 Z"
    />
  </svg>
);

const Track = ({ idPrefix }) => (
  <div className="flex shrink-0 items-center">
    {Array.from({ length: 4 }).map((_, i) =>
      PHRASES.map((text, ti) => (
        <span
          key={`${idPrefix}-${i}-${ti}`}
          className="flex shrink-0 items-center whitespace-nowrap"
        >
          {text}
          <span className="mx-8 text-white/50 select-none" aria-hidden>
            ◆
          </span>
        </span>
      )),
    )}
  </div>
);

const Marquee = () => {
  return (
    <div className="w-full">
      <Wave />
      <div className="overflow-hidden bg-[#967965] py-2.5 text-white">
        <div className="flex w-max animate-marquee text-xs font-medium uppercase tracking-widest sm:text-sm">
          <Track idPrefix="a" />
          <Track idPrefix="b" />
        </div>
      </div>
      <Wave flip />
    </div>
  );
};

export default Marquee;
