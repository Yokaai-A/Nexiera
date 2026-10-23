import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/Logo_Akhir.png"
        alt="Nexiera"
        width={210}
        height={42}
        priority
        className="h-9 w-auto object-contain"
      />
    </div>
  );
}
