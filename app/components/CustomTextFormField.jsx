import React from 'react';

const CustomTextFormField = ({ question, exampleButtonClick, textFromFieldValue, textFormFieldOnChange, isRequired = false, }) => {
  return (
    <div className="text-left w-full font-medium">
      <h3 className="inline-block">
        {question}
        {isRequired && <span className="text-red-500">*</span>}
        <p className="text-sm inline-block ml-2 pb-2">For example</p>
        <button
          onClick={exampleButtonClick}
          className="ml-2 text-sm text-blue-500 underline"
        >
          Click here
        </button>
      </h3>
      <div className="mb-1 flex flex-col w-full">
        <input
          type="text"
          value={textFromFieldValue}
          onChange={textFormFieldOnChange} 
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
        />
      </div>
    </div>
  );
};

export default CustomTextFormField;
