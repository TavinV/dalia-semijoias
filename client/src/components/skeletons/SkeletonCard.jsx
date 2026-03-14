const SkeletonCard = () => {
  return (
    <div className="w-full h-full animate-pulse">
      {/* imagem */}
      <div className="w-full aspect-square bg-gray-400 rounded"></div>

      {/* conteúdo */}
      <div className="mt-4 space-y-2">
        <div className="h-5 w-3/4 bg-gray-400 rounded"></div>

        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-400 rounded"></div>
          <div className="h-3 w-5/6 bg-gray-400 rounded"></div>
          <div className="h-3 w-2/3 bg-gray-400 rounded"></div>
        </div>

        <div className="h-5 w-1/3 bg-gray-400 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
