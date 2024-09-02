// /pages/api/revalidate-menu.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Revalida la página del menú público
    await res.revalidate('/menu');
    return res.json({ revalidated: true });
  } catch (err) {
    // En caso de error
    return res.status(500).json({ error: 'Error revalidating' });
  }
}
