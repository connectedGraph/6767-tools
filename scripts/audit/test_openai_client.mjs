import OpenAI from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";

const apiKey = process.env.KO78_API_KEY;
const baseURL = process.env.KO78_BASE_URL;
const proxyUrl = process.env.KO78_PROXY_URL || "http://127.0.0.1:7890";

if (!apiKey || !baseURL) {
    console.error("Set KO78_API_KEY and KO78_BASE_URL before running this diagnostic.");
    process.exit(1);
}

const httpAgent = new HttpsProxyAgent(proxyUrl);

const client = new OpenAI({
    apiKey,
    baseURL,
    httpAgent,
});

try {
    console.log("Sending request to ko78 with stream: true and tools...");
    const stream = await client.chat.completions.create({
        model: "gpt-5.6-luna",
        messages: [{ role: "user", content: "Use read tool to read pages/sokoban.html" }],
        tools: [{
            type: "function",
            function: {
                name: "read",
                description: "Read file",
                parameters: {
                    type: "object",
                    properties: { path: { type: "string" } },
                    required: ["path"]
                }
            }
        }],
        stream: true,
    });
    console.log("Stream received! Reading chunks...");
    for await (const chunk of stream) {
        console.log("CHUNK:", JSON.stringify(chunk));
    }
    console.log("Done!");
} catch (err) {
    console.error("CAUGHT ERROR:", err);
}
