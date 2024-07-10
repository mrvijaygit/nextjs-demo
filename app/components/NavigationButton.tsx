"use client";

import { useRouter } from "next/navigation";

interface NavigationButtonsProps {
  nextLink: string;
  onNextClick: () => Promise<boolean>;
}

export default function NavigationButtons({ nextLink, onNextClick }: NavigationButtonsProps) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  const handleNextClick = async () => {
    const proceed = await onNextClick();
    if (proceed) {
      router.push(nextLink);
    }
  };

  return (
    <div className="flex w-full justify-between pt-5">
      <button onClick={handleBackClick} className="px-6 py-2 bg-red-500 text-white rounded-lg mr-2">
        BACK
      </button>
      <button onClick={handleNextClick} className="px-6 py-2 bg-blue-500 text-white rounded-lg ml-2">
        NEXT
      </button>
    </div>
  );
}
