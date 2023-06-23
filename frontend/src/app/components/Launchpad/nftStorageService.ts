import { RcFile } from "antd/lib/upload";
import { NFTStorage } from "nft.storage";
import { TokenInput } from "nft.storage/dist/src/token";
import { NftStorageToken } from "../../../utils/constants";
import { LaunchFormData } from "./constants";

const client = new NFTStorage({
  token: NftStorageToken!,
});

function getImageBlob(data: LaunchFormData): File | Blob {
  const toFile = (file: RcFile) => {
    const [_type, extension] = file.type.split("/");

    return new File([data?.logoImage], `image.${extension}`, {
      type: data.logoImage.type,
    });
  };

  return toFile(data?.logoImage);
}

export async function uploadFileIpfs(payload: LaunchFormData) {
  let metaData: TokenInput;

  metaData = {
    name: payload.tokenName,
    image: getImageBlob(payload),
    description: "Bonding curve token issued by CurvX",
  };
  return client.store(metaData);
}
