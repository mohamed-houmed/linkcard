type CoverImageProps = {
  imageUrl: string | null;
};

export default function CoverImage({
  imageUrl,
}: CoverImageProps) {
  return (
    <div className="relative h-60 w-full overflow-hidden rounded-t-[32px]">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Cover"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-violet-700 to-fuchsia-600" />

          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute -left-10 top-6 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-pink-400/20 blur-3xl" />
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
    </div>
  );
}