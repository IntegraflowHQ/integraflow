import { parsedSurveys } from "@/utils";
import { BaseSurvey, IntegraflowClient } from "@integraflow/sdk";
import { Survey } from "@integraflow/web";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const apiKey = process.env.INTEGRAFLOW_API_KEY;
const apiUrl = process.env.INTEGRAFLOW_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Survey[]>) {
    const client = new IntegraflowClient({ apiKey, apiUrl });
    const activeSurveys = await client.activeSurveys({ first: 1 });
    console.log("activeSurveys: ", activeSurveys);
    const surveys = parsedSurveys(activeSurveys as unknown as BaseSurvey);

    res.status(200).json(surveys);
}
