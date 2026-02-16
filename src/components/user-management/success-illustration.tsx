import React from "react";
import Image from "next/image";

interface SuccessIllustrationProps {
  className?: string;
}

export function SuccessIllustration({
  className = "",
}: SuccessIllustrationProps) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Image
        src="/success.png"
        alt="Success"
        width={200}
        height={130}
        className="object-contain"
      />
    </div>
  );
}
