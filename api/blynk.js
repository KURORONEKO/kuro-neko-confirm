module.exports = async function handler(req, res) {
  const { pin, value } = req.query;

  if (!pin || value === undefined) {
    return res.status(400).json({ error: 'Missing pin or value' });
  }

  const BLYNK_AUTH = process.env.BLYNK_AUTH_TOKEN;
  
  if (!BLYNK_AUTH) {
    return res.status(500).json({ error: 'Server configuration error: Token not found' });
  }

  const BLYNK_URL = `https://blynk.cloud/external/api/update?token=${BLYNK_AUTH}&${pin}=${value}`;

  try {
    const response = await fetch(BLYNK_URL);
    if (response.ok) {
      // ตอบกลับเป็น HTML เพื่อแสดงผลสวยงามบนเบราว์เซอร์
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="th">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: sans-serif; text-align: center; padding-top: 50px; background-color: #f4f6f9;">
          <div style="max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #28a745; margin-bottom: 10px;">บันทึกข้อมูลเรียบร้อยแล้ว</h2>
            <p style="color: #666;">อัปเดตสถานะ ${pin} เป็น ${value} สำเร็จ สามารถปิดหน้านี้ได้ทันที</p>
          </div>
        </body>
        </html>
      `);
    } else {
      res.status(response.status).json({ error: 'Blynk API Error' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
