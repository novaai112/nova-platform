export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { query, isUUID } = req.body;

    try {
        const filterCondition = isUUID ? `id.eq.${query}` : `license_key.eq.${query}`;
        const url = `${process.env.SUPABASE_API_URL}?select=id,status,result_url,created_at&${filterCondition}&order=created_at.desc`;

        const supabaseResponse = await fetch(url, {
            method: "GET",
            headers: { 
                "apikey": process.env.SUPABASE_API_KEY, 
                "Authorization": `Bearer ${process.env.SUPABASE_API_KEY}` 
            }
        });

        const data = await supabaseResponse.json();

        if (supabaseResponse.ok) {
            return res.status(200).json(data);
        } else {
            return res.status(supabaseResponse.status).json({ error: 'Search failed', details: data });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
