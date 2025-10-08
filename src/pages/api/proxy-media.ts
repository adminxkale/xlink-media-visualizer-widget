import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { bussinesNumber } = req.query;
  const { clientNumber } = req.query;

  if (!bussinesNumber) {
    res.status(400).json({ error: "Missing bussines_number parameter" });
    return;
  }
    if (!clientNumber) {
    res.status(400).json({ error: "Missing clientNumber parameter" });
    return;
  } 
  const apiUrl = `https://1p7yki6h17.execute-api.us-east-1.amazonaws.com/dev/${bussinesNumber}/${clientNumber}`;
  //const apiUrl = `https://zqi6swpat4.execute-api.us-east-1.amazonaws.com/dev/xlink_groups/${encodeURIComponent(

  try {
    const apiRes = await fetch(apiUrl);
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    console.error("[proxy-media] fetch error", err);
    res.status(500).json({ error: "Proxy error" });
  }
}
