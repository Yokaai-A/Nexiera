import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt="Nexiera"
        width={56}
        height={56}
        className="h-14 w-14 object-contain"
      />
      <span className="text-xl font-bold tracking-tight text-slate-900">
        NEXIERA
      </span>
    </div>
  );
}
