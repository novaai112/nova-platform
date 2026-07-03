export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { payloadArr, licenseKey, macAddress } = req.body;

    try {
        const supabaseResponse = await fetch(process.env.SUPABASE_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": process.env.SUPABASE_API_KEY,
                "Authorization": `Bearer ${process.env.SUPABASE_API_KEY}`,
                "Prefer": "return=representation"
            },
            body: JSON.stringify({
                json_payload: payloadArr,
                status: "pending",
                license_key: licenseKey,
                mac_address: macAddress
            })
        });

        const data = await supabaseResponse.json();

        if (supabaseResponse.ok) {
            return res.status(200).json(data);
        } else {
            return res.status(supabaseResponse.status).json({ error: 'Submission failed', details: data });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
