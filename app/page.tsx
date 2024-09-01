"use client";

import { useState, useEffect } from "react";
import { useChat } from "ai/react";
import Sentiment from "sentiment";

// Interface for sentiment analysis result
interface SentimentResult {
  score: number;
  comparative: number;
  positive: string[];
  negative: string[];
  funnyScore?: number;
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
    { emoji: "🔔", value: "Knock Knock" },
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
  };

  const sentiment = new Sentiment();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  useEffect(() => {
    if (messages.length > 0 && !messages[messages.length - 1]?.content.startsWith("Generate")) {
      const joke = messages[messages.length - 1].content;
      const result = sentiment.analyze(joke, { extras: customWords });

      const funnyScore = result.score + result.positive.length * 2 - result.negative.length * 2;

      setSentimentResult({ ...result, funnyScore });
    }
  }, [messages]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 via-blue-500 to-warm-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-20"></div>
        <div className="w-64 h-64 rounded-full bg-white opacity-10 absolute animate-pulse"></div>
        <div className="w-96 h-96 rounded-full bg-white opacity-10 absolute top-32 right-32 animate-pulse"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-3xl p-8 bg-white bg-opacity-30 rounded-xl shadow-xl backdrop-blur-md">
        <div className="flex flex-col items-center justify-center space-y-12 text-white">
          
          {/* Header Section */}
          <div className="text-center">
            <h2 className="text-5xl font-extrabold drop-shadow-md">Joke Generator</h2>
            <p className="mt-2 text-lg text-gray-200">
              Customize and generate your joke by selecting a topic, tone, and voice.
            </p>
          </div>

          {/* Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Topic Card */}
            <div className="bg-white bg-opacity-40 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <h3 className="text-2xl font-semibold text-black">Topic</h3>
              <div className="mt-4 space-y-2">
                {topics.map(({ value, emoji }) => (
                  <label key={value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="topic"
                      value={value}
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-pink-500"
                    />
                    <span className="text-lg text-black">{`${emoji} ${value}`}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tone Card */}
            <div className="bg-white bg-opacity-40 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <h3 className="text-2xl font-semibold text-black">Tone</h3>
              <div className="mt-4 space-y-2">
                {tones.map(({ value, emoji }) => (
                  <label key={value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tone"
                      value={value}
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-pink-500"
                    />
                    <span className="text-lg text-black">{`${emoji} ${value}`}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Voice Card */}
            <div className="bg-white bg-opacity-40 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <h3 className="text-2xl font-semibold text-black">Voice</h3>
              <div className="mt-4 space-y-2">
                {voices.map(({ value, emoji }) => (
                  <label key={value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="voice"
                      value={value}
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-pink-500"
                    />
                    <span className="text-lg text-black">{`${emoji} ${value}`}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Joke Button */}
          <button
            className="relative bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-4 px-8 rounded-full shadow-xl transform transition-transform hover:scale-105 active:scale-95"
            disabled={isLoading || !state.topic || !state.tone || !state.voice}
            onClick={() =>
              append({
                role: "user",
                content: `Generate a joke about ${state.topic} in a ${state.tone} tone. Voiced by ${state.voice}.`,
              })
            }
          >
            {isLoading ? "Generating..." : "Generate Joke"}
          </button>

          {/* Display Generated Joke and Sentiment Analysis */}
          {messages.length > 0 && !messages[messages.length - 1]?.content.startsWith("Generate") && (
            <div className="w-full mt-8 p-6 bg-white bg-opacity-30 rounded-lg shadow-inner text-white">
              {/* Display the latest joke */}
              <p className="text-xl font-medium mb-4">{messages[messages.length - 1]?.content}</p>
              
              {/* Display sentiment analysis results if available */}
              {sentimentResult && (
                <div className="mt-4 p-4 bg-white bg-opacity-50 rounded-lg">
                  <h4 className="text-xl font-semibold mb-2 text-black">Sentiment Analysis</h4>
                  <p className="text-black"><strong>Score:</strong> {sentimentResult.score}</p>
                  <p className="text-black"><strong>Comparative:</strong> {sentimentResult.comparative.toFixed(2)}</p>
                  <p className="text-black"><strong>Positive Words:</strong> {sentimentResult.positive.join(", ") || "None"}</p>
                  <p className="text-black"><strong>Negative Words:</strong> {sentimentResult.negative.join(", ") || "None"}</p>
                  <p className="text-black"><strong>Funny Score:</strong> {sentimentResult.funnyScore}</p>
                  <p className="text-black">
                    <strong>Overall Sentiment:</strong>{" "}
                    {sentimentResult.score > 0
                      ? "Positive"
                      : sentimentResult.score < 0
                      ? "Negative"
                      : "Neutral"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
