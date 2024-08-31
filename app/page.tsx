"use client";

import { useState, useEffect } from "react";
import { useChat } from "ai/react";
import Sentiment from "sentiment";

interface SentimentResult {
  score: number;
  comparative: number;
  positive: string[];
  negative: string[];
  funnyScore?: number;  // Custom score to determine how funny the joke is
}

export default function JokeGenerator() {
  const { messages, append, isLoading } = useChat();
  const topics = [
    { emoji: "🤣", value: "Work" },
    { emoji: "👥", value: "People" },
    { emoji: "🐶", value: "Animals" },
    { emoji: "🍔", value: "Food" },
    { emoji: "🗳️", value: "Politics" },
  ];
  const tones = [
    { emoji: "😜", value: "Sarcastic" },
    { emoji: "🤣", value: "Witty" },
    { emoji: "😂", value: "Goofy" },
    { emoji: "😂", value: "Knock Knock" },
  ];
  const voices = [
    { emoji: "☕️", value: "Jerry Seinfeld" },
    { emoji: "😜", value: "Kevin Hart" },
    { emoji: "💁‍♀️", value: "Wanda Sykes" },
    { emoji: "🌈", value: "Margaret Cho" },
    { emoji: "🤣", value: "Eddie Murphy" },
    { emoji: "🔥", value: "Chris Rock" },
  ];
  const [state, setState] = useState({
    topic: "",
    tone: "",
    voice: "",
  });
  const [sentimentResult, setSentimentResult] = useState<SentimentResult | null>(null);

  const customWords = {
    hilarious: 5,
    laugh: 3,
    joke: 2,
    boring: -3,
    "not funny": -5,
    // Add more custom words and their sentiment scores
  };

  const sentiment = new Sentiment();

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  useEffect(() => {
    if (messages.length > 0 && !messages[messages.length - 1]?.content.startsWith("Generate")) {
      const joke = messages[messages.length - 1].content;
      const result = sentiment.analyze(joke, { extras: customWords });

      // Custom logic to determine how funny the joke is
      const funnyScore = result.score + result.positive.length * 2 - result.negative.length * 2;

      setSentimentResult({ ...result, funnyScore });
    }
  }, [messages]);

  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-black">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Joke Generator</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customize the joke by selecting a topic, tone, and a famous comedian.
            </p>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-blue-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Topic</h3>

            <div className="flex flex-wrap justify-center">
              {topics.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    value={value}
                    name="topic"
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-blue-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Tones</h3>

            <div className="flex flex-wrap justify-center">
              {tones.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="tone"
                    value={value}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-blue-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Comedians</h3>

            <div className="flex flex-wrap justify-center">
              {voices.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="voice"
                    value={value}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading || !state.topic || !state.tone || !state.voice}
            onClick={() =>
              append({
                role: "user",
                content: `Generate a joke about ${state.topic} in a ${state.tone} tone. Voiced by ${state.voice}.`,
              })
            }
          >
            Generate Joke
          </button>

          <div
            hidden={
              messages.length === 0 ||
              messages[messages.length - 1]?.content.startsWith("Generate")
            }
            className="bg-opacity-25 bg-blue-700 rounded-lg p-4 text-black"
          >
            <p>{messages[messages.length - 1]?.content}</p>
            {sentimentResult && (
              <div className="mt-4 p-2 bg-opacity-50 bg-gray-500 rounded-lg">
                <h4 className="text-lg font-semibold">Sentiment Analysis</h4>
                <p>Score: {sentimentResult.score}</p>
                <p>Comparative: {sentimentResult.comparative.toFixed(2)}</p>
                <p>Positive Words: {sentimentResult.positive.join(", ")}</p>
                <p>Negative Words: {sentimentResult.negative.join(", ")}</p>
                <p>Funny Score: {sentimentResult.funnyScore}</p>
                <p>
                  Overall Sentiment:{" "}
                  {sentimentResult.score > 0
                    ? "Positive"
                    : sentimentResult.score < 0
                    ? "Negative"
                    : "Neutral"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
