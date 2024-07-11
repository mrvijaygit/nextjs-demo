import React from 'react';

const PageHeadingTitle = ({ title }) => {
  return (
    <h1 className="text-xl font-semibold mb-4 text-blue-700 text-center w-full bg-blue-100 p-3">
      {title}
    </h1>
  );
};

export default PageHeadingTitle;
