import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import path from "path";

// Read calendar data from the file
const calendarFilePath = path.join(process.cwd(), "calendar.json");
const calendarFileContents = fs.readFileSync(calendarFilePath, "utf8");
const calendarData = JSON.parse(calendarFileContents);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const query = req.body.query || "";

  // Check if the query relates to the calendar
  if (query.toLowerCase().includes("when is my")) {
    const event = query.split("when is my")[1].trim();
    for (const entry of calendarData) {
      if (entry.events.some((e) => e.toLowerCase().includes(event))) {
        res.status(200).json({ result: `Your ${event} is on ${entry.date}` });
        return;
      }
    }
    res
      .status(200)
      .json({ result: `Could not find information about your ${event}` });
    return;
  }

  // If the query doesn't relate to the calendar, use OpenAI
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: query,
      temperature: 0.6,
    });

    console.log("API response:", completion.data.choices[0].text);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
