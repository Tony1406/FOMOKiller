import type { Request, Response } from 'express';
import { createHash } from 'crypto';

const cloudName  = () => process.env.CLOUDINARY_CLOUD_NAME!;
const apiKey     = () => process.env.CLOUDINARY_API_KEY!;
const apiSecret  = () => process.env.CLOUDINARY_API_SECRET!;

function sign(params: Record<string, string>): string {
    const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
    return createHash('sha1').update(sorted + apiSecret()).digest('hex');
}

export const uploadImage = async (req: Request & { file?: any }, res: Response) => {
    if (!req.file) { res.status(400).json({ error: 'No file provided' }); return; }
    try {
        const timestamp = String(Math.floor(Date.now() / 1000));
        const params    = { folder: 'fomokiller', timestamp };
        const signature = sign(params);

        const body = new FormData();
        body.append('file',      new Blob([req.file.buffer], { type: req.file.mimetype }));
        body.append('api_key',   apiKey());
        body.append('timestamp', timestamp);
        body.append('signature', signature);
        body.append('folder',    'fomokiller');

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName()}/image/upload`, {
            method: 'POST',
            body,
        });

        if (!response.ok) { res.status(500).json({ error: 'Cloudinary upload failed' }); return; }
        const data = await response.json() as any;
        res.json({ url: data.secure_url });
    } catch {
        res.status(500).json({ error: 'Upload failed' });
    }
};
