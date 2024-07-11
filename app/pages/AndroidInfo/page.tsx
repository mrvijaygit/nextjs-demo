"use client";

import NavigationButtons from "@/app/components/NavigationButton";
import toBase64 from "@/app/utils/file_utils";
import handlePlatformNext from "@/app/utils/platforms_support";
import { ChangeEvent, useState } from "react";
import PageHeaderContainer from "./../../components/PageHeader";
import PageHeadingTitle from "./../../components/PageHeadingTitle";
import TextFormField from "./../../components/TextFormField";

export default function AndroidInfo() {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  const [keystoreFileName, setKeyStoreFileName] = useState("");
  const [keystoreBase64, setKeyStoreBase64] = useState<string | null>(null);

  const [firebaseJsonFileName, setFirebaseJsonFileName] = useState("");
  const [firebaseJsonBase64, setFirebaseJsonBase64] = useState<string | null>(
    null
  );

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setKeyStoreFileName(file.name);
      const { base64 } = await toBase64(file as File);
      setKeyStoreBase64(base64);
    }
  };

  const handleFirebaseFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFirebaseJsonFileName(file.name);
      const { base64 } = await toBase64(file as File);
      setFirebaseJsonBase64(base64);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const nextPageHandler = (): string => {
    const dataString = localStorage.getItem("eztoForm");
    let data = JSON.parse(dataString ?? "");
    const supportPlatforms = data["support_platforms"];
    const platforms = supportPlatforms.filter(
      (platform: string) => platform !== "Android"
    );
    const next = handlePlatformNext(platforms);
    return next;
  };

  const handleNextClick = async (): Promise<boolean> => {
    if (inputValue.trim() === "") {
      setInputError("This field cannot be empty.");
      return false;
    }
    const dataString = localStorage.getItem("eztoForm");
    if (dataString) {
      try {
        let data = JSON.parse(dataString);
        console.log("data android", data["support_platforms"]);
        data.android_app_bundle_id = inputValue;
        data.keystore_file = keystoreBase64;
        data.android_firebase_json = firebaseJsonBase64;
        localStorage.setItem("eztoForm", JSON.stringify(data));
        console.log("Updated localStorage data:", data);
        return true;
      } catch (e) {
        console.error("Error parsing JSON from localStorage:", e);
        return false;
      }
    }
    return false;
  };

  return (
    <PageHeaderContainer>
      <PageHeadingTitle title="Android Information" />
      <div className="overflow-y-auto pr-2 flex-grow p-2">

        <TextFormField
            question="1) What should be App Bundle ID? (eg: io.ezto.verify)" 
            textFromFieldValue={inputValue} 
            textFormFieldOnChange={handleInputChange}
            isRequired
            >
        </TextFormField>

        {inputError && <p className="text-red-500 mb-4">{inputError}</p>}

        <h6 className="mb-1 text-black font-medium">
          2) Attach Keystore file with password to Sign the Release App. If you
          leave this empty, we will generate a new keystore and will use it. To
          Generate keystore file you can run following command.
        </h6>
        <h6 className="mb-1 text-green-800 pb-2 text-sm">
          keytool -genkeypair -v -keystore key.jks -keyalg RSA -keysize 2048
          -validity 10000 -alias key
        </h6>

        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-center"
            >
              Choose File
            </button>
          </div>
          {keystoreFileName && (
            <div className="flex items-center space-x-2">
              <p className="text-black col">{keystoreFileName}</p>
            </div>
          )}
        </div>

        <p className="text-black pt-2 font-medium">
          3) For push notifications to work, please attach firebase json file.
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
          <li>Generate a new project</li>
          <li>Add Android app</li>
          <li>Goto project settings - General</li>
          <li>Download google-services.json and attach here.</li>
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
