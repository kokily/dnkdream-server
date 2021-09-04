import { Context, Next } from 'koa';
import Router from 'koa-router';
import aws from 'aws-sdk';
import fs from 'fs';
import moment from 'moment';

const upload = new Router();

type FileType = {
  name: string;
  path: string;
  type: string;
};

type ReturnType = {
  key: string;
  url: string;
};

async function uploadImage(file: FileType): Promise<ReturnType> {
  aws.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });

  const s3 = new aws.S3({
    apiVersion: '2006-03-01',
  });

  const Bucket = 'image.dnkdream.com';

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path);
    const time = `${moment().format('YYMMDD_HHmmss')}`;
    const filename = `${time}_${file.name.trim()}`;
    const params = {
      Bucket,
      Body: stream,
      Key: filename,
      ContentType: file.type,
    };

    stream.on('error', function (err) {
      reject(err);
    });

    s3.upload(params, (err: Error, data: aws.S3.ManagedUpload.SendData) => {
      if (err) {
        reject(err);
      } else if (data) {
        resolve({
          key: data.Key,
          url: data.Location,
        });
      }
    });
  });
}

upload.post('/', async (ctx: Context, next: Next) => {
  if (ctx.request.files) {
    const file = ctx.request.files.file;

    // @ts-ignore
    const { key, url } = await uploadImage(file);

    ctx.body = { key, url };
  } else {
    return next();
  }
});

export default upload;
