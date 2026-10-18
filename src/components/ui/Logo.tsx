import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="h-16 w-16 overflow-hidden">
        <Image
          src="/Logo_Dua.png"
          alt="Nexiera"
          width={64}
          height={64}
          className="h-16 w-16 scale-[1.05] object-cover"
        />
      </div>
      <span className="logo-wordmark text-xl font-bold tracking-tight text-black transition-colors">
        NEXIERA
      </span>
    </div>
  );
}
