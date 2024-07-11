"use client";

import { ChangeEvent, useState } from "react";
import NavigationButtons from "@/app/components/NavigationButton";
import handlePlatformNext from "@/app/utils/platforms_support";
import PageHeaderContainer from "./../../components/PageHeader";
import PageHeadingTitle from "./../../components/PageHeadingTitle";
import TextFormField from "./../../components/TextFormField";

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
      } else {
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
    const supportPlatforms = data["support_platforms"];
    const platforms = supportPlatforms.filter(
      (platform: string) =>
        platform !== "Android" && platform !== "iOS" && platform !== "macOS"
    );
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
    <PageHeaderContainer>
      <PageHeadingTitle title="macOS Information" />
      <div className="flex flex-col items-start justify-center flex-grow p-2 w-full">
        <TextFormField
          question="1) What should be App Bundle ID? (eg: io.ezto.verify)"
          textFromFieldValue={inputValue}
          textFormFieldOnChange={handleInputChange}
          isRequired
        ></TextFormField>
        {inputError && <p className="text-red-500">{inputError}</p>}
      </div>
      <NavigationButtons
        nextLink={nextPageHandler()}
        onNextClick={handleNextClick}
      />
    </PageHeaderContainer>
  );
}
