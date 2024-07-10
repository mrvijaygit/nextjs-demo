"use client";

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";

export default function ThemeInfo() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exampleImage, setExampleImage] = useState("");


  const [primaryColor, setPrimaryColor] = useState("");
  const [primaryColorError, setPrimaryColorError] = useState("");


  const [font, setFont] = useState("");
  const [fontError, setFontError] = useState("");

  const [AppLogoFile, setAppLogoFile] = useState<File | null>(null);
  const [AppLogoFileName, setAppLogoFileName] = useState("");
  const [AppLogoImage, setAppLogoImage] = useState<string | null>(null);
  const [AppLogoFileError, setAppLogoFileError] = useState("");
  const [AppLogoBase64, setAppLogoBase64] = useState<string | null>(null);
  

  const [AppFullLogoFile, setAppFullLogoFile] = useState<File | null>(null);
  const [AppFullLogoFileName, setAppFullLogoFileName] = useState("");
  const [AppFullLogoImage, setAppFullLogoImage] = useState<string | null>(null);
  const [AppFullLogoFileError, setFullAppLogoFileError] = useState("");
  const [AppFullLogoBase64, setAppFullLogoBase64] = useState<string | null>(null);
  

  const handlePrimaryColor = (e: ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };

  const handleFont = (e: ChangeEvent<HTMLInputElement>) => {
    setFont(e.target.value);
  };

  const handleAppLogoFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log("handle file change called");
    if (e.target.files) {
      const file = e.target.files[0];
      setAppLogoFileName(file.name);
      const base64 = await toBase64(file as File);
      setAppLogoBase64(base64 as string);

      // Create a URL for the file for preview if it's an image
      const fileTypes = ["image/jpeg", "image/png", "image/gif"];
      if (fileTypes.includes(file.type)) {
        const url = URL.createObjectURL(file);
        setAppLogoImage(url);
      } else {
        setAppLogoImage(null);
      }
    }
  };

  const handleAppFullLogoFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log("handle file change called");
    if (e.target.files) {
      const file = e.target.files[0];
      setAppFullLogoFileName(file.name);
      const base64 = await toBase64(file as File);
      setAppFullLogoBase64(base64 as string);

      // Create a URL for the file for preview if it's an image
      const fileTypes = ["image/jpeg", "image/png", "image/gif"];
      if (fileTypes.includes(file.type)) {
        const url = URL.createObjectURL(file);
        setAppFullLogoImage(url);
      } else {
        setAppFullLogoImage(null);
      }
    }
  };

  const handleNextClick = () => {
    if (primaryColor.trim() === "") {
      setPrimaryColorError("This field cannot be empty.");
      return;
    }
    if (font.trim() === "") {
      setFontError("This field cannot be empty.");
      return;
    }
    if (AppLogoBase64 === null){
      setAppLogoFileError("This field cannot be empty.");
      return;
    }
    if(AppFullLogoBase64 === null){
      setFullAppLogoFileError("This field cannot be empty.");
      return;
    }
    const dataString = localStorage.getItem("eztoForm");
    if (dataString) {
      try {
        let data = JSON.parse(dataString);
        data.primary_color = primaryColor;
        data.font_theme = font;
        data.app_logo = AppLogoBase64;
        data.app_full_logo = AppFullLogoBase64;
        localStorage.setItem("eztoForm", JSON.stringify(data));
        console.log("Updated localStorage data:", data);
        router.push("/pages/Welcome")
      } catch (e) {
        console.error("Error parsing JSON from localStorage:", e);
      }
    }
  };


  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
  
      fileReader.readAsDataURL(file);
  
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
  
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };  


  const openModal = (image: string) => {
    setExampleImage(image);
    setIsModalOpen(true);
};

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div
        className="bg-white p-6 rounded-lg shadow-lg text-left flex flex-col justify-between"
        style={{ width: "580px", height: "680px" }}
      >
        <h1 className="text-xl font-semibold mb-4 text-blue-700 text-center w-full bg-blue-100 p-3">
        Theme Information
        </h1>
        <div className="text-black overflow-y-auto pr-2 flex-grow p-2">


          <div className="text-left w-full font-medium">
            <h3 className="inline-block">
            1) What should be the primary app colour? Eg: #FF00FF
              <span className="text-red-500">*</span>
              <p className="text-sm inline-block ml-2 pb-2">For example</p>
              <button
                onClick={() => openModal("/images/app_theme.png")}
                className="ml-2 text-sm text-blue-500 underline"
              >
                Click here
              </button>
            </h3>
          </div>


          <div className="mb-4">
            <input
              type="text"
              value={primaryColor}
              onChange={handlePrimaryColor}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
            />
            {primaryColorError && (
              <p className="text-red-500">{primaryColorError}</p>
            )}
          </div>


          <div className="text-left w-full font-medium">
            <h3 className="inline-block">
            2) Please specify font details, if any. [Please make sure you have
            license to font, if required]
              <span className="text-red-500">*</span>
            </h3>
          </div>

          <div className="mb-4 pt-2">
            <input
              type="text"
              value={font}
              onChange={handleFont}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
            />
            {fontError && <p className="text-red-500">{fontError}</p>}
          </div>


          <div className="text-left w-full font-medium">
            <h3 className="inline-block">
            3) Please upload Transparent App Logo [Square - 1024x1024]. SVG Logo
            preferred
              <span className="text-red-500">*</span>
              <p className="text-sm inline-block ml-2 pb-2">For example</p>
              <button
                onClick={() => openModal("/images/app_logo.png")}
                className="ml-2 text-sm text-blue-500 underline"
              >
                Click here
              </button>
            </h3>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="file"
                onChange={handleAppLogoFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button
                type="button"
                className="px-4 py-2 mb-6 bg-blue-500 text-white rounded-lg text-center"
              >
                Choose File
              </button>
            </div>
            {AppLogoFileName && (
              <div className="flex items-center space-x-2">
                <p className="text-black">{AppLogoFileName}</p>
                {AppLogoImage && (
                  <img
                    src={AppLogoImage}
                    alt="File preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
              </div>
            )}
          </div>
          {AppLogoFileError && (
              <p className="text-red-500">{AppLogoFileError}</p>
            )}


          <div className="text-left w-full font-medium">
            <h3 className="inline-block">
            4) Full Logo that should be displayed inside app
              <span className="text-red-500">*</span>
              <p className="text-sm inline-block ml-2 pb-2">For example</p>
              <button
                onClick={() => openModal("/images/app_full_logo.png")}
                className="ml-2 text-sm text-blue-500 underline"
              >
                Click here
              </button>
            </h3>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="file"
                onChange={handleAppFullLogoFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-center"
              >
                Choose File
              </button>
            </div>
            {AppFullLogoFileName && (
              <div className="flex items-center space-x-2">
                <p className="text-black">{AppFullLogoFileName}</p>
                {AppFullLogoImage && (
                  <img
                    src={AppFullLogoImage}
                    alt="File preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
              </div>
            )}
          </div>
          {AppFullLogoFileError && (
              <p className="text-red-500">{AppFullLogoFileError}</p>
          )}


        </div>
        <div className="flex w-full justify-between pt-5">
          <Link href="/">
            <button className="px-6 py-2 bg-red-500 text-white rounded-lg mr-2">
              BACK
            </button>
          </Link>
          <button
            onClick={handleNextClick}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg ml-2"
          >
            NEXT
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <button onClick={closeModal} className="mb-4 text-red-500">
              Close
            </button>
            <Image
              src= {exampleImage}
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
