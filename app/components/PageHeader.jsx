import React from 'react';

const PageHeaderContainer = (props) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div
        className="bg-white p-5 rounded-lg shadow-lg text-left flex flex-col justify-center items-center"
        style={{ width: "580px", height: "680px" }}
      >
        {props.children}
      </div>
    </div>
  );
};

export default PageHeaderContainer;