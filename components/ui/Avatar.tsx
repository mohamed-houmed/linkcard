type AvatarProps = {
  imageUrl?: string | null;
  size?: number;
};

export default function Avatar({
  imageUrl,
  size = 132,
}: AvatarProps) {
  return (
    <div
      className="
        rounded-full
        bg-gradient-to-br
        from-violet-500
        via-blue-500
        to-cyan-400
        p-1
        shadow-xl
        shadow-violet-500/20
      "
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Profile"
          width={size}
          height={size}
          className="
            rounded-full
            border-4
            border-slate-950
            object-cover
          "
        />
      ) : (
        <div
          className="
            flex
            items-center
            justify-center
            rounded-full
            border-4
            border-slate-950
            bg-slate-700
            text-4xl
            font-bold
            text-white
          "
          style={{
            width: size,
            height: size,
          }}
        >
          MH
        </div>
      )}
    </div>
  );
}