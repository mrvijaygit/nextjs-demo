"use client";

import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationButtons from "@/app/components/NavigationButton";
import handlePlatformNext from "@/app/utils/platforms_support";

export default function IosInfo() {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };


  const handleNextClick = async (): Promise<boolean> => {
    if (validateInput(inputValue)) {
        const dataString = localStorage.getItem("eztoForm");
        console.log("Started one one one localStorage data:", dataString);
        if (dataString) {
          try {
            let data = JSON.parse(dataString);
            data.macos_app_bundle_id = inputValue;
            localStorage.setItem("eztoForm", JSON.stringify(data));
            return true;
          } catch (e) {
            console.error("Error parsing JSON from localStorage:", e);
            return false;
          }
        }else{
            return false;
        }
      } else {
        console.log("Invalid input");
        return false;
      }
  };


  const nextPageHandler = (): string => {
    const dataString = localStorage.getItem("eztoForm");
    let data = JSON.parse(dataString ?? "");
    const supportPlatforms = data["support_platforms"]
    const platforms = supportPlatforms.filter((platform: string) => (platform !== 'Android' && platform !== 'iOS' && platform !== 'macOS'));
    const next = handlePlatformNext(platforms);
    return next;
  };


  const validateInput = (value: string) => {
    if (value.trim() === "") {
      setInputError("Invalid app bundle id");
      return false;
    }
    setInputError("");
    return true;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div
        className="bg-white p-6 rounded-lg shadow-lg text-left flex flex-col justify-between"
        style={{ width: "580px", height: "680px" }}
      >
        <h1 className="text-xl font-semibold mb-4 text-blue-700 text-center w-full bg-blue-100 p-3">
        macOS Information
        </h1>
        <div className="flex flex-col items-start justify-center flex-grow p-2">
        <h6 className="mb-1 text-black pb-2 font-medium">
            What should be App Bundle ID? (eg: io.ezto.verify) *
          </h6>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full p-2 border mb-4  border-gray-300 rounded-lg text-black"
          />
          {inputError && <p className="text-red-500">{inputError}</p>}
        </div>
        <NavigationButtons
          nextLink={nextPageHandler()}
          onNextClick={handleNextClick}
        />
      </div>
    </div>
  );
}
