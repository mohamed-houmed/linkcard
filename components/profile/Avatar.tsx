type AvatarProps = {
  imageUrl: string | null;
  name: string;
};

export default function Avatar({
  imageUrl,
  name,
}: AvatarProps) {
  return (
    <div className="absolute left-1/2 top-60 -translate-x-1/2 -translate-y-1/2">
      <div className="rounded-full border-4 border-white bg-white p-1 shadow-2xl">
        <div className="h-32 w-32 overflow-hidden rounded-full bg-slate-200">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700 text-5xl font-bold text-white">
              {name.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}