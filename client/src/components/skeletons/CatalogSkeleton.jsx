// components/skeletons/CatalogSkeleton.jsx

import SkeletonCard from "./SkeletonCard";

const CatalogSkeleton = ({ count = 8 }) => {
  return (
    <div className="w-full">
      <div
        className="
                    grid 
                    grid-cols-2        /* 2 coluna em mobile */
                    xs:grid-cols-2     /* 2 colunas em mobile grande */
                    sm:grid-cols-2     /* 2 colunas em tablet pequeno */
                    md:grid-cols-3     /* 3 colunas em tablet */
                    lg:grid-cols-3     /* 3 colunas em desktop */
                    xl:grid-cols-4     /* 4 colunas em desktop grande */
                    2xl:grid-cols-4    /* 4 colunas em telas enormes */
                    gap-6              /* gap maior entre cards */
                    sm:gap-8           /* gap ainda maior em telas maiores */
                    w-screen 
                    max-w-full 
                    m-0 
                    p-6                /* padding maior nas laterais */
                    sm:p-8             /* padding ainda maior em telas maiores */
      "
      >
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default CatalogSkeleton;
