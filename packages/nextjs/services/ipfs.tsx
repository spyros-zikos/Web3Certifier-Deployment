import { createThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRD_WEB_CLIENT as string,
});

export const singleUpload = async (file: any, path?: string, onError?: ((arg0: string) => void) | undefined) => {
  // const uploadPath = (path || file.path) + '-' + Date.now();
  try {
    const uri: unknown = await upload({
      client,
      files: [file],
    });
    const urlOfUpload = `https://${process.env.NEXT_PUBLIC_THIRD_WEB_CLIENT}.ipfscdn.io/ipfs/${
      (uri as string).split("//")[1]
    }`;
    return urlOfUpload;
  } catch (err) {
    onError && onError(`Error uploading ${file.path}`);
    console.log(err);
    throw `error uploading ${file.path}, ${path} to IPFS`;
  }
};