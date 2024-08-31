"use client";

import { useState } from "react";
import { useChat } from "ai/react";

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
    { emoji: "😂", value: "knock knock" },
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

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-black">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Joke Generator</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customize the joke by selecting a topic, tone and a famous comedian.
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
            disabled={isLoading || !state.topic || !state.tone ||!state.voice}
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
            {messages[messages.length - 1]?.content}
          </div>
        </div>
      </div>
    </main>
  );
}