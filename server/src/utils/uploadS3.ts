import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import env from '../config/env';

const s3 = new S3Client({ region: env.aws.region });

export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: env.aws.bucket ?? "",
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (request, file, cb) => {
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        }
    })
});