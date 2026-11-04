// Minimal verify-and-deliver. GET /api/deliver?session_id=cs_...
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const key = process.env.STRIPE_RESTRICTED_KEY;
  const link = process.env.PAYMENT_LINK_ID;
  const sid = String(req.query.session_id || '');
  if (!key || !link) return res.status(503).send('Not configured');
  if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(sid)) return res.status(400).send('Bad session id');
  const r = await fetch('https://api.stripe.com/v1/checkout/sessions/' + sid, { headers: { Authorization: 'Bearer ' + key } });
  if (!r.ok) return res.status(404).send('Session not found');
  const s = await r.json();
  if (s.status !== 'complete' || s.payment_status !== 'paid' || s.payment_link !== link) return res.status(402).send('Payment not confirmed');
  const file = path.join(process.cwd(), 'private', 'product.zip');
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="product.zip"');
  fs.createReadStream(file).pipe(res);
};
