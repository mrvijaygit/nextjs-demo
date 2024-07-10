"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import NavigationButtons from "@/app/components/NavigationButton";
import PlatformsList from "@/app/enum/platform_list";
import handlePlatformNext from "@/app/utils/platforms_support";

export default function AppInfo() {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsAndCondition, setTermsAndCondition] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedPlatfromsError, setSelectedPlatformsError] = useState("");
  

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedPlatforms([...selectedPlatforms, value]);
    } else {
      setSelectedPlatforms(
        selectedPlatforms.filter((platform) => platform !== value)
      );
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleTermsAndCondition = (e: ChangeEvent<HTMLInputElement>) => {
    setTermsAndCondition(e.target.value);
  };

  const handlePrivacyPolicy = (e: ChangeEvent<HTMLInputElement>) => {
    setPrivacyPolicy(e.target.value);
  };

  const handleNextClick = async (): Promise<boolean> => {
    if (selectedPlatforms.length == 0) {
      setSelectedPlatformsError("This field cannot be empty.");
      return false;
    }
    if (inputValue.trim() === "") {
      setInputError("This field cannot be empty.");
      return false;
    }
    const dataString = localStorage.getItem("eztoForm");
    if (dataString) {
      try {
        let data = JSON.parse(dataString);
        data.app_name = inputValue;
        data.support_platforms = selectedPlatforms;
        data.terms_and_condition = termsAndCondition;
        data.privacy_policy = privacyPolicy;
        localStorage.setItem("eztoForm", JSON.stringify(data));
        console.log("Updated localStorage data:", data);
        return true;
      } catch (e) {
        console.error("Error parsing JSON from localStorage:", e);
      }
    }
    return false;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextPageHandler = () : string => {
    const next = handlePlatformNext(selectedPlatforms);
    return next;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div
        className="bg-white p-5 rounded-lg shadow-lg text-left flex flex-col justify-center items-center"
        style={{ width: "580px", height: "680px" }}
      >
        <h1 className="text-xl font-semibold mb-4 text-blue-700 text-center w-full bg-blue-100 p-3">
          Common App Info
        </h1>
        <div className="text-black p-3 overflow-y-auto flex-grow flex flex-col justify-center items-center w-full">
          <h3 className="text-left w-full font-medium">1) Select Platforms</h3>
          <div className="flex mb-4 items-center mr-4 p-5 space-x-5">
            {PlatformsList.map((platform) => (
              <div className="pl-3" key={platform}>
                <input
                  type="checkbox"
                  id={platform}
                  value={platform}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                <label className="pl-3" htmlFor={platform}>
                  {platform}
                </label>
              </div>
            ))}
            
          </div>
          {selectedPlatfromsError && (
              <p className="text-left text-red-500">{selectedPlatfromsError}</p>
            )}

          

          <div className="text-left w-full font-medium">
            <h3 className="inline-block">
              2) What should be the App Name that should be displayed to User?
              <span className="text-red-500">*</span>
              <p className="text-sm inline-block ml-2 pb-2">For example</p>
              <button
                onClick={openModal}
                className="ml-2 text-sm text-blue-500 underline"
              >
                Click here
              </button>
            </h3>
          </div>

          <div className="mb-4 flex flex-col w-full">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
            />
            {inputError && (
              <p className="text-left text-red-500">{inputError}</p>
            )}
          </div>

          <div className="text-left w-full font-medium">
            <h3 className="inline-block">
              3) What should be the App Terms And Conditions that should be
              displayed to User?
              <p className="text-sm inline-block ml-2 pb-2">For example</p>
              <button
                onClick={() =>
                  window.open(
                    "https://ezto.io/verify/terms-and-conditions",
                    "_blank"
                  )
                }
                className="ml-2 text-sm text-blue-500 underline"
              >
                Click here
              </button>
            </h3>
          </div>

          <div className="mb-4 flex flex-col w-full">
            <input
              type="text"
              value={termsAndCondition}
              onChange={handleTermsAndCondition}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
            />
          </div>

          <div className="text-left w-full font-medium">
            <h3 className="inline-block">
              4) What should be the App Privacy Policy that should be displayed
              to User?
              <p className="text-sm inline-block ml-2 pb-2">For example</p>
              <button
                onClick={() =>
                  window.open("https://ezto.io/verify/privacy-policy", "_blank")
                }
                className="ml-2 text-sm text-blue-500 underline"
              >
                Click here
              </button>
            </h3>
          </div>

          <div className="mb-4 flex flex-col w-full">
            <input
              type="text"
              value={privacyPolicy}
              onChange={handlePrivacyPolicy}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
            />
          </div>
        </div>
        <NavigationButtons
          nextLink={nextPageHandler()}
          onNextClick={handleNextClick}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <button onClick={closeModal} className="mb-4 text-red-500">
              Close
            </button>
            <Image
              src="/images/app_name.png"
              alt="Example Image"
              width={400}
              height={300}
            />
          </div>
        </div>
      )}
    </div>
  );
}
