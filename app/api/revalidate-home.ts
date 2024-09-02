// /pages/api/revalidate-home.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Revalida la página principal (ruta '/')
    await res.revalidate('/');
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error revalidating' });
  }
}
