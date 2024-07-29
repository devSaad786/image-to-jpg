import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import sharp from 'sharp';
import { Readable } from 'stream';
import { promisify } from 'util';
import { pipeline } from 'stream';

const upload = multer({ storage: multer.memoryStorage() });

// Promisify pipeline for easier async/await usage
const pipelineAsync = promisify(pipeline);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check if the method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }

  // Use Multer to parse the file
  await new Promise<void>((resolve, reject) => {
    upload.single('image')(req as any, res as any, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  const file = (req as any).file;

  // Check if the file is present
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const buffer = await sharp(file.buffer).jpeg().toBuffer();
    const stream = Readable.from(buffer);
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.jpg');

    await pipelineAsync(stream, res);
  } catch (error:any) {
    res.status(500).json({ error: `Error processing image: ${error.message}` });
  }
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
