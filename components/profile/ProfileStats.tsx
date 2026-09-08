import {
  Eye,
  QrCode,
  Users,
} from "lucide-react";

type ProfileStatsProps = {
  views: number;
  scans: number;
  connections: number;
};

export default function ProfileStats({
  views,
  scans,
  connections,
}: ProfileStatsProps) {
  const stats = [
    {
      label: "Connections",
      value: connections,
      icon: <Users size={22} />,
    },
    {
      label: "Views",
      value: views,
      icon: <Eye size={22} />,
    },
    {
      label: "QR Scans",
      value: scans,
      icon: <QrCode size={22} />,
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="
            rounded-2xl
            border
            border-white/10
            bg-white/5
            p-5
            backdrop-blur-xl
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-violet-500/40
          "
        >
          <div className="mb-3 flex justify-center text-violet-400">
            {stat.icon}
          </div>

          <p className="text-center text-2xl font-bold text-white">
            {stat.value}
          </p>

          <p className="mt-1 text-center text-sm text-slate-400">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}