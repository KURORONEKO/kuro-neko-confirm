export default async function handler(req, res) {
  const { pin, value } = req.query;

  if (!pin || value === undefined) {
    return res.status(400).json({ error: 'Missing pin or value' });
  }

  const BLYNK_AUTH = process.env.BLYNK_AUTH_TOKEN;
  
  if (!BLYNK_AUTH) {
    return res.status(500).json({ error: 'Server configuration error: Token not found' });
  }

  const BLYNK_URL = `https://sgp1.blynk.cloud/external/api/update?token=${BLYNK_AUTH}&${pin}=${value}`;

  try {
    const response = await fetch(BLYNK_URL);
    if (response.ok) {
      res.status(200).json({ success: true, message: `Updated ${pin} to ${value}` });
    } else {
      res.status(response.status).json({ error: 'Blynk API Error' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}