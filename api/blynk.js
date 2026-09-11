module.exports = async function handler(req, res) {
  const { pin, value } = req.query;

  if (!pin || value === undefined) {
    return res.status(400).json({ error: 'Missing pin or value' });
  }

  const BLYNK_AUTH = process.env.BLYNK_AUTH_TOKEN;

  if (!BLYNK_AUTH) {
    return res.status(500).json({ error: 'Server configuration error: Token not found' });
  }

  // แปลง pin เป็นตัวพิมพ์เล็ก
  const formattedPin = pin.toLowerCase();
  
  // ใช้ formattedPin ใน URL ให้ถูกต้อง
  const BLYNK_URL = `https://blynk.cloud/external/api/update?token=${BLYNK_AUTH}&${formattedPin}=${value}`;

  try {
    const response = await fetch(BLYNK_URL);
    if (response.ok) {
      // คืนค่า JSON ให้ Frontend นำไปแสดงผลต่อ (ลบชุด HTML ค้างคาวออกแล้ว)
      return res.status(200).json({ success: true, pin: formattedPin, value });
    } else {
      return res.status(response.status).json({ error: 'Blynk API Error' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
