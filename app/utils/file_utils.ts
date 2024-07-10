// fileUtils.ts
const toBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
  
      fileReader.readAsDataURL(file);
  
      fileReader.onload = () => {
        resolve({ base64: fileReader.result as string, mimeType: file.type });
      };
  
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
};

export default toBase64;
