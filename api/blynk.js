module.exports = async function handler(req, res) {
  const { pin, value } = req.query;

  if (!pin || value === undefined) {
    return res.status(400).json({ error: 'Missing pin or value' });
  }

  const BLYNK_AUTH = process.env.BLYNK_AUTH_TOKEN;
  if (!BLYNK_AUTH) {
    return res.status(500).json({ error: 'Server configuration error: Token not found' });
  }

  const formattedPin = pin.toLowerCase();
  const BLYNK_URL = `https://blynk.cloud/external/api/update?token=${BLYNK_AUTH}&${formattedPin}=${value}`;

  try {
    const response = await fetch(BLYNK_URL);
    if (response.ok) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="th">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Kuro Neko - บันทึกสำเร็จ</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
            .card { background: #ffffff; padding: 40px 30px; border-radius: 20px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
            .icon { font-size: 52px; margin-bottom: 15px; }
            h1 { font-size: 20px; color: #0f172a; margin-bottom: 10px; font-weight: 700; }
            p { color: #64748b; font-size: 14px; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">${value === '1' ? '🎬' : '❌'}</div>
            <h1>${value === '1' ? 'ยืนยันการทำรายการสำเร็จ!' : 'ยกเลิกการทำรายการสำเร็จ'}</h1>
            <p>บันทึกสถานะเรียบร้อยแล้ว คุณสามารถปิดหน้านี้ได้ทันที</p>
          </div>
        </body>
        </html>
      `);
    } else {
      return res.status(response.status).json({ error: 'Blynk API Error' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
