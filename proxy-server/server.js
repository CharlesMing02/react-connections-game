require("dotenv").config();

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const OpenAI = require("openai").default;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

const PORT = process.env.PORT || 3000;

let gameDataCache = {
  date: null,
  id: null,
  data: null,
  pickupLines: null,
  images: null,
};

async function getPickupLines(wordsArray) {
  const words = wordsArray.join(", ");
  const query = `Make the best pickup line for the following 4 words, being as cheeky, suggestive, and creative as you can: ${words}. Score them out of 10 for humor and creativity and respond as a json object sorted from best to worst.`;
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'You are a witty, flirty comedian that is as racy and suggestive as you are allowed to be. You are an expert in pickup lines. If asked to return pickup lines for 4 words, respond exactly like the following example, with no extra characters.\n{\n  "pickupLines": [\n    {\n      "word": "ANISE",\n      "line": "x",\n      "overallScore": {\n        "Creativity": 7,\n        "Humor": 6\n      }\n    },\n    {\n      "word": "FENNEL",\n      "line": "y",\n      "overallScore": {\n        "Creativity": 8,\n        "Humor": 7\n      }\n    },\n    {\n      "word": "LICORICE",\n      "line": "z",\n      "overallScore": {\n        "Creativity": 6,\n        "Humor": 7\n      }\n    },\n    {\n      "word": "TARRAGON",\n      "line": "a",\n      "overallScore": {\n        "Creativity": 7,\n        "Humor": 8\n      }\n    }\n  ]\n}',
      },
      {
        role: "user",
        content: query,
      },
    ],
    temperature: 1,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  console.log(completion.choices[0].message.content);
  return JSON.parse(completion.choices[0].message.content).pickupLines;
}

const convertPuzzleData = (data) => {
  return data.categories.map((category, index) => ({
    category: category.title,
    words: category.cards.map((card) => card.content),
    difficulty: index + 1, // Assuming difficulty increases with each category
  }));
};

// Endpoint for fetching puzzle answers
app.get("/puzzle-answers/:date", async (req, res) => {
  const requestedDate = req.params.date;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Please use YYYY-MM-DD format." });
  }

  const url = `https://www.nytimes.com/svc/connections/v2/${requestedDate}.json`;

  if (gameDataCache.date === requestedDate && gameDataCache.data) {
    console.log("Using cached puzzle answers", gameDataCache.data);
    return res.json({
      date: gameDataCache.date,
      data: gameDataCache.data,
      id: gameDataCache.id,
    });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    const convertedData = convertPuzzleData(data);

    gameDataCache.date = requestedDate;
    gameDataCache.id = data.id;
    gameDataCache.data = convertedData;

    res.json({
      date: gameDataCache.date,
      data: gameDataCache.data,
      id: gameDataCache.id,
    });
  } catch (error) {
    console.error("Error fetching puzzle data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/hardcoded-game", (req, res) => {
  const hardcodedGameData = {
    date: "2024-03-09",
    id: 69,
    data: [
      {
        category: "Favorite Pics",
        words: ["Strip", "River", "Facetime", "Skate"],
        difficulty: 1,
        imageSrc: "",
      },
      {
        category: "Dishes shared together",
        words: ["Tofu pudding", "Sushi", "Pie", "Curry"],
        difficulty: 2,
        imageSrc: "",
      },
      {
        category: "Notes",
        words: ["Thirty", "Booklist", "Quarter", "Memo"],
        difficulty: 3,
        imageSrc: "",
      },
      {
        category: "Mountains overcome",
        words: ["Distance", "Elephant", "Bartender", "Doubt"],
        difficulty: 4,
        imageSrc: "",
      },
    ],
    pickupLines: [
      [
        {
          word: "Strip",
          line: "Wanna strip away our doubts?",
          overallScore: {
            Creativity: 9,
            Humor: 8,
          },
        },
        {
          word: "River",
          line: "Are we in denial, or is this a river of attraction?",
          overallScore: {
            Creativity: 8,
            Humor: 7,
          },
        },
        {
          word: "Facetime",
          line: "FaceTime or face mine?",
          overallScore: {
            Creativity: 7,
            Humor: 9,
          },
        },
        {
          word: "Skate",
          line: "Wanna skate into my heart?",
          overallScore: {
            Creativity: 6,
            Humor: 7,
          },
        },
      ],
      [
        {
          word: "Pie",
          line: "Are we talking about pie, or the sweet slice of this moment?",
          overallScore: {
            Creativity: 9,
            Humor: 8,
          },
        },
        {
          word: "Curry",
          line: "Is it hot in here, or is it just your curry appeal?",
          overallScore: {
            Creativity: 8,
            Humor: 9,
          },
        },
        {
          word: "Sushi",
          line: "Are you sushi? Because I want to roll with you.",
          overallScore: {
            Creativity: 7,
            Humor: 8,
          },
        },
        {
          word: "Tofu pudding",
          line: "Your heart is Taiwanese tofu pudding, soft and sweet.",
          overallScore: {
            Creativity: 6,
            Humor: 7,
          },
        },
      ],
      [
        {
          word: "Booklist",
          line: "Are you a booklist? Because I want to check you out.",
          overallScore: {
            Creativity: 9,
            Humor: 8,
          },
        },
        {
          word: "Memo",
          line: "Did you get the memo? You're due in my heart by noon.",
          overallScore: {
            Creativity: 8,
            Humor: 7,
          },
        },
        {
          word: "Thirty",
          line: "Is it thirty or are you just heating up the room?",
          overallScore: {
            Creativity: 7,
            Humor: 8,
          },
        },
        {
          word: "Quarter",
          line: "Are you a quarter? Because you add value to my day.",
          overallScore: {
            Creativity: 6,
            Humor: 7,
          },
        },
      ],
      [
        {
          word: "Bartender",
          line: "Are you a bartender? Because you've got the mix I've been looking for.",
          overallScore: {
            Creativity: 9,
            Humor: 8,
          },
        },
        {
          word: "Elephant",
          line: "Is it an elephant in the room or are we just too attracted to each other?",
          overallScore: {
            Creativity: 8,
            Humor: 7,
          },
        },
        {
          word: "Distance",
          line: "Want to be my girlfriend?",
          overallScore: {
            Creativity: 7,
            Humor: 6,
          },
        },
        {
          word: "Doubt",
          line: "Why doubt when we could be certain about us?",
          overallScore: {
            Creativity: 6,
            Humor: 5,
          },
        },
      ],
    ],
    // images:
  };
  res.json(hardcodedGameData);
});

// Endpoint for fetching pickup lines
app.get("/pickup-lines/:date", async (req, res) => {
  const requestedDate = req.params.date;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Please use YYYY-MM-DD format." });
  }

  if (gameDataCache.date !== requestedDate || !gameDataCache.data) {
    return res
      .status(404)
      .json({ error: "Puzzle data not found for the requested date." });
  }

  if (gameDataCache.date === requestedDate && gameDataCache.pickupLines) {
    console.log("Using cached pickup lines", gameDataCache.pickupLines);
    return res.json({
      date: gameDataCache.date,
      pickupLines: gameDataCache.pickupLines,
    });
  }

  try {
    let allPickupLines = [];
    for (let item of gameDataCache.data) {
      const lines = await getPickupLines(item.words);
      allPickupLines.push(lines);
    }

    gameDataCache.pickupLines = allPickupLines;
    res.json({
      date: gameDataCache.date,
      pickupLines: gameDataCache.pickupLines,
    });
  } catch (error) {
    console.error("Error fetching pickup lines:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function getImage(category) {
  const imagePrompt = `create the cutest most creative kawaii drawing you can that embodies \"${category}\". do not include text. value simplicity. incorporate typical kawaii imagery that best fits with the theme`;
  const imageResponse = await openai.images.generate({
    model: "dall-e-3",
    prompt: imagePrompt,
    response_format: "b64_json",
  });
  console.log("image revised prompt: ", imageResponse.data[0].revised_prompt);
  return imageResponse.data[0].b64_json;
}

// Endpoint for fetching images
app.get("/images/:date", async (req, res) => {
  const requestedDate = req.params.date;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Please use YYYY-MM-DD format." });
  }

  if (gameDataCache.date !== requestedDate || !gameDataCache.data) {
    return res
      .status(404)
      .json({ error: "Puzzle data not found for the requested date." });
  }

  if (gameDataCache.date === requestedDate && gameDataCache.images) {
    console.log("Using cached images", gameDataCache.date);
    return res.json({
      date: gameDataCache.date,
      images: gameDataCache.images,
    });
  }

  try {
    let allImages = [];
    for (let item of gameDataCache.data) {
      const image = await getImage(item.category);
      console.log("image generated for: ", item.category);
      allImages.push(image);
    }

    gameDataCache.images = allImages;
    res.json({
      date: gameDataCache.date,
      images: gameDataCache.images,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DEPRECATED OLD COMBINED TOOK TOO LONG
app.get("/game-data/:date", async (req, res) => {
  const requestedDate = req.params.date;

  // Validate the requested date format (simple regex match for YYYY-MM-DD format)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Please use YYYY-MM-DD format." });
  }

  const url = `https://www.nytimes.com/svc/connections/v2/${requestedDate}.json`;

  // Check if the data for the requested date is cached
  if (gameDataCache.date === requestedDate && gameDataCache.data) {
    console.log("Using cached game data", gameDataCache);
    return res.json(gameDataCache);
  }

  // Fetch and cache the game data for the new date
  try {
    const response = await fetch(url); // Use your actual data-fetching logic here
    const data = await response.json();
    const convertedData = convertPuzzleData(data);

    let allPickupLines = [];
    for (let item of convertedData) {
      const lines = await getPickupLines(item.words);
      allPickupLines.push(lines);
    }

    // Update the cache with the new date's data
    gameDataCache = {
      date: requestedDate,
      id: data.id,
      data: convertedData,
      pickupLines: allPickupLines,
    };

    res.json(gameDataCache);
  } catch (error) {
    console.error("Error fetching game data for the requested date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
