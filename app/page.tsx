// pages/index.tsx

"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleNextClick = () => {
    if (validateInput(inputValue)) {
      const data = { gmail: inputValue };
      localStorage.setItem("eztoForm", JSON.stringify(data));
      router.push("/pages/AppInfo");
    } else {
      setInputError("Please enter a valid Gmail address.");
    }
  };

  const validateInput = (value: string) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div
        className="bg-white p-5 rounded-lg shadow-lg text-left flex flex-col justify-center items-center"
        style={{ width: "580px", height: "680px" }}
      >
        <h1 className="text-xl font-semibold mb-4 text-blue-700 text-center w-full bg-blue-100 p-3">
          EZTO VERIFY APP REQUIREMENT
        </h1>
        <div className="text-black p-5 overflow-y-auto flex-grow flex flex-col justify-center w-full">
          <h6 className="mb-1 pb-2 text-black">Enter your Gmail ID</h6>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
          />
          {inputError && (
            <p className="text-red-500 text-sm mb-4">{inputError}</p>
          )}
          <button
            onClick={handleNextClick}
            className="w-half px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
