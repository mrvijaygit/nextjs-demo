const handlePlatformNext = (selectedPlatforms: string[]): string => {
  let nextLink = "/";

  if (selectedPlatforms.includes("Android")) {
    nextLink = "/pages/AndroidInfo";
    return nextLink;
  } else if (selectedPlatforms.includes("iOS")) {
    nextLink = "/pages/IosInfo";
    return nextLink;
  } else if (selectedPlatforms.includes("macOS")) {
    nextLink = "/pages/MacosInfo";
    return nextLink;
  } else if (selectedPlatforms.includes("Windows")) {
    nextLink = "/pages/WindowsInfo";
    return nextLink;
  }
  return "/pages/ThemeInfo";
};


export default handlePlatformNext