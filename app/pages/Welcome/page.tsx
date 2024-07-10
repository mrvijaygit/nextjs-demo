"use client";

import JSZip from "jszip";

export default function Third() {
  
  const handleNextClick = async () => {
    const dataString = localStorage.getItem("eztoForm");
    console.log("Started one one one localStorage data:", dataString);
    if (dataString) {
      try {
        let data = JSON.parse(dataString);
        console.log("Updated localStorage data:", data);

        // Create a new JSZip instance
        const zip = new JSZip();

        // Add the JSON data to the zip file
        zip.file("EztoRequirement.json", JSON.stringify(data, null, 2));

        // Generate the zip file
        const zipContent = await zip.generateAsync({ type: "blob" });

        // Create a FormData object to send the zip file
        const formData = new FormData();
        formData.append(
          "file",
          new File([zipContent], "EztoRequirement.zip", {
            type: "application/zip",
          })
        );

        console.log("Form Data", formData);

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          console.log("final data", data);
          if (res.ok) {
            alert("File uploaded successfully!");
          } else {
            alert("Error uploading file: " + data.error);
          }
        } catch (error) {
          alert("Error uploading file: " + error);
        }
      } catch (e) {
        console.error("Error parsing JSON from localStorage:", e);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div
        className="bg-white p-6 rounded-lg shadow-lg text-left flex flex-col justify-between items-center"
        style={{ width: "580px", height: "680px" }}
      >
        <div className="flex flex-col items-center justify-center flex-grow p-2">
          <h6 className="text-black text-center font-bold pb-5">
            THANKS FOR CHOOSING EZTO VERIFY
          </h6>
          <button
            onClick={handleNextClick}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg ml-2"
          >
            DOWNLOAD REQUIREMENT
          </button>
        </div>
      </div>
    </div>
  );
}
