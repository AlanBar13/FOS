import * as dotenv from "dotenv";
import path from "path";
const rootPath = path.join(__dirname, "../../../.env.local");
dotenv.config({ path: rootPath });

export default {
  mode: process.env.MODE,
  port: process.env.PORT,
  postgresUrl: process.env.PGURL,
  jwtSecret: process.env.JWT_SECRET,
  companyName: process.env.COMPANY_NAME,
  aws: {
    region: process.env.AWS_S3_REGION,
    bucket: process.env.AWS_S3_BUCKET_NAME,
  },
  email: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};
