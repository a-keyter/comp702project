import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.3,
});

// OPTIONAL CONFIG FOR CLAUDE BY ANTHROPIC - Requires Package Install - npm i @langchain/anthropic

// import { ChatAnthropic } from "@langchain/anthropic";

// export const model = new ChatAnthropic({
//   model: "claude-3.5-sonnet",
//   temperature: 0.3,
// });

// OPTIONAL CONFIG FOR MISTRALAI - Requires Package Install - npm i @langchain/mistralai

// import { ChatMistralAI } from "@langchain/mistralai";

// expot const model = new ChatMistralAI({
//   model: "mistral-large-latest",
//   temperature: 0.3,
// });



