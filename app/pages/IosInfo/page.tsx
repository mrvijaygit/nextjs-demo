"use client";

import { ChangeEvent, useState } from "react";
import NavigationButtons from "@/app/components/NavigationButton";
import handlePlatformNext from "@/app/utils/platforms_support";
import PageHeaderContainer from "./../../components/PageHeader";
import PageHeadingTitle from "./../../components/PageHeadingTitle";
import TextFormField from "./../../components/TextFormField";
import toBase64 from "@/app/utils/file_utils";

export default function IosInfo() {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  const [firebaseJsonFileName, setFirebaseJsonFileName] = useState("");
  const [firebaseJsonBase64, setFirebaseJsonBase64] = useState<string | null>(
    null
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFirebaseFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFirebaseJsonFileName(file.name);
      const { base64 } = await toBase64(file as File);
      setFirebaseJsonBase64(base64);
    }
  };

  const handleNextClick = async (): Promise<boolean> => {
    if (validateInput(inputValue)) {
      const dataString = localStorage.getItem("eztoForm");
      console.log("Started one one one localStorage data:", dataString);
      if (dataString) {
        try {
          let data = JSON.parse(dataString);
          console.log("Started localStorage data:", data);
          data.ios_app_bundle_id = inputValue;
          data.ios_firebase_plist = firebaseJsonBase64;
          localStorage.setItem("eztoForm", JSON.stringify(data));
          console.log("Updated localStorage data:", data);
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
      (platform: string) => platform !== "Android" && platform !== "iOS"
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
      <PageHeadingTitle title="iOS Information" />
      <div className="flex flex-col items-start justify-center flex-grow p-2 w-full">
        <TextFormField
          question="1) What should be App Bundle ID? (eg: io.ezto.verify)"
          textFromFieldValue={inputValue}
          textFormFieldOnChange={handleInputChange}
          isRequired
        ></TextFormField>
        {inputError && <p className="text-red-500">{inputError}</p>}
        <p className="text-black pt-2 font-medium">
          2) For push notifications to work, please attach firebase plist file.
        </p>
        <p className="text-black">To generate firebase.json file:</p>
        <ul className="text-black p-4 list-disc list-inside">
          <li>
            Login to{" "}
            <a
              href="https://console.firebase.google.com/"
              className="text-blue-500 underline"
            >
              Firebase Console
            </a>
          </li>
          <li>Add iOS app</li>
          <li>Goto project settings - General</li>
          <li>Download GoogleService-Info.plist and attach here.</li>
        </ul>
        <p className="text-black pb-2 text-sm">
          If this is not attached, we will generate a firebase json file once we
          get access to firebase console
        </p>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="file"
              onChange={handleFirebaseFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-center"
            >
              Choose File
            </button>
          </div>
          {firebaseJsonFileName && (
            <div className="flex items-center space-x-2">
              <p className="text-black">{firebaseJsonFileName}</p>
            </div>
          )}
        </div>
      </div>
      <NavigationButtons
        nextLink={nextPageHandler()}
        onNextClick={handleNextClick}
      />
    </PageHeaderContainer>
  );
}
