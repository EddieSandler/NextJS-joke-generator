import OpenAI from "openai";
   import { OpenAIStream, StreamingTextResponse } from "ai";

   const openai = new OpenAI();

   export const runtime = "edge";

   export async function POST(req: Request) {
     const { messages } = await req.json();

     const response = await openai.chat.completions.create({
       model: "gpt-4o-mini",
       stream: true,
       messages: [
         {
           role: "system",
           content: `You are a professional comedian who has
           been hired to
           craft a series of hilarious jokes for a
           new comedy special. The jokes should be
           witty, clever, and laugh-out-loud funny,
           exploring a variety of topics and themes
           based on user inputs.
           Each joke should be unique, memorable,
           and tailored to the selected topic and tone,
           with unexpected punchlines and clever wordplay.
           Your goal is to leave the audience in stitches
           and make them laugh with your creative and
           sidesplitting humor. use the voice of a great comedian input by the user`,
         },
         ...messages,
       ],
     });

     const stream = OpenAIStream(response);
     return new StreamingTextResponse(stream);
   }