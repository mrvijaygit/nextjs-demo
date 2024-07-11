"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import NavigationButtons from "@/app/components/NavigationButton";
import PlatformsList from "@/app/enum/platform_list";
import handlePlatformNext from "@/app/utils/platforms_support";
import PageHeaderContainer from "./../../components/PageHeader";
import PageHeadingTitle from "./../../components/PageHeadingTitle";
import CustomTextFormField from "./../../components/CustomTextFormField";
import { remoteConfig, fetchAndActivate, getValue } from './../../../firebase';

export default function AppInfo() {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsAndCondition, setTermsAndCondition] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedPlatfromsError, setSelectedPlatformsError] = useState("");
  const [supportPlatforms, setSupportPlatforms] = useState([]);


  useEffect(() => {
    const fetchRemoteConfig = async () => {
      if (!remoteConfig) {
        return;
      }

      try {
        await fetchAndActivate(remoteConfig);
        const paramValue = getValue(remoteConfig, 'support_platforms').asString();
        const arrayValue = JSON.parse(paramValue);
        setSupportPlatforms(arrayValue)
        console.log("array value : ", arrayValue);
      } catch (error) {
        console.error('Error fetching remote config:', error);
      }
    };

    fetchRemoteConfig();
  }, []);

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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    input: string
  ) => {
    if (input === "app_name") {
      setInputValue(e.target.value);
    } else if (input === "terms_and_condition") {
      setTermsAndCondition(e.target.value);
    } else if (input === "privacy_policy") {
      setPrivacyPolicy(e.target.value);
    }
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

  const nextPageHandler = (): string => {
    const next = handlePlatformNext(selectedPlatforms);
    return next;
  };

  return (
    <PageHeaderContainer>
      <PageHeadingTitle title="Common App Info" />
      <div className="text-black p-3 overflow-y-auto flex-grow flex flex-col justify-center w-full">
        <h3 className="text-left w-full font-medium">1) Select Platforms</h3>
        <div className="flex mb-1 items-center mr-4 p-5 space-x-5">
          {supportPlatforms.map((platform) => (
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
          <p className="text-left pb-3 text-red-500">{selectedPlatfromsError}</p>
        )}


        <CustomTextFormField
            question="2) What should be the App Name that should be displayed to User?" 
            exampleButtonClick= {openModal}
            textFromFieldValue={inputValue} 
            textFormFieldOnChange={(e : any) => handleInputChange(e, "app_name")}
            isRequired
            >
        </CustomTextFormField>

        <div className="mb-4 flex flex-col w-full">
          {inputError && <p className="text-left text-red-500">{inputError}</p>}
        </div>


        <CustomTextFormField
            question="3) What should be the App Terms And Conditions that should be
            displayed to User?" 
            exampleButtonClick= {()=>window.open(
              "https://ezto.io/verify/terms-and-conditions",
              "_blank"
            )}
            textFromFieldValue={termsAndCondition} 
            textFormFieldOnChange={(e : any) => handleInputChange(e, "terms_and_condition")}>
         </CustomTextFormField>

         <CustomTextFormField
            question="4) What should be the App Privacy Policy that should be displayed to
            User?" 
            exampleButtonClick= {()=>window.open(
              "https://ezto.io/verify/privacy-policy",
              "_blank"
            )}
            textFromFieldValue={privacyPolicy} 
            textFormFieldOnChange={(e : any) => handleInputChange(e, "privacy_policy")}>
         </CustomTextFormField>

      </div>
      <NavigationButtons
        nextLink={nextPageHandler()}
        onNextClick={handleNextClick}
      />
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
    </PageHeaderContainer>
  );
}
