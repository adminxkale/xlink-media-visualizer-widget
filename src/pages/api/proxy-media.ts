import type { NextApiRequest,NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required' });
    }
    //const apiUrl = `https://api.xlinkapp.cloud/management-multitenant/external/management-tables/xlink-${process.env.NEXT_PUBLIC_STAGE}-channel/${tenantId}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch media' });
        }
        const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
        const buffer = await response.arrayBuffer();
        res.setHeader('Content-Type', contentType);
        res.send(Buffer.from(buffer));
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
