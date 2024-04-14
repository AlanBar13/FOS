import qr from "qrcode";
import logger from "./logger";

export const genQRCode = async (text: string): Promise<string | null> => {
  try {
    const qrcode = await qr.toDataURL(text);
    return qrcode;
  } catch (error) {
    logger.error(`[QR] Creation failed ${error}`);
    return null;
  }
};
