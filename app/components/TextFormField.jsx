import React from 'react';

const TextFormField = ({ question, textFromFieldValue, textFormFieldOnChange, isRequired = false, }) => {
  return (
    <div className="text-black font-medium w-full">
        <h6 className="mb-1">
        {question}
        {isRequired && <span className="text-red-500">*</span>}
        </h6>
        <input
        type="text"
        value={textFromFieldValue}
        onChange={textFormFieldOnChange}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg text-black"
        />
    </div>
  );
};

export default TextFormField;
