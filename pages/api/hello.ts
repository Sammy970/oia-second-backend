import clientPromise from "./_connector";

import { NextApiRequest, NextApiResponse } from "next";
import microCors from "micro-cors";

const cors = microCors();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await clientPromise;

  res.status(200).json({ name: "John Doe" });
};

export default cors(handler);
