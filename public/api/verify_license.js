export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { licenseKey, macAddress } = req.body;

    try {
        // Uses the hidden Vercel Environment Variable
        const url = `${process.env.GAS_API_URL}?action=verify&license_key=${licenseKey}&mac_address=${macAddress}`;
        const gasResponse = await fetch(url);
        const text = await gasResponse.text();

        return res.status(200).json({ result: text });
    } catch (error) {
        return res.status(500).json({ error: 'Server Connection Error' });
    }
}
