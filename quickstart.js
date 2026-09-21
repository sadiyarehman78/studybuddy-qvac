import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} from "@qvac/sdk";

import readline from "node:readline/promises";
import {
  stdin as input,
  stdout as output
} from "node:process";

const rl = readline.createInterface({
  input,
  output
});

let modelId;

try {
  console.log("Loading local AI model...\n");

  modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0
  });

  console.log("✅ StudyBuddy Local AI is ready!");
  console.log("Ask anything. Type 'exit' to quit.\n");

  while (true) {
    const question = await rl.question("You: ");

    if (question.trim().toLowerCase() === "exit") {
      break;
    }

    if (!question.trim()) {
      console.log("Please enter a question.\n");
      continue;
    }

    const history = [
      {
        role: "system",
        content:
          "You are StudyBuddy, a helpful local AI study assistant. " +
          "Answer clearly and directly. Keep answers concise unless " +
          "the user asks for detailed explanations."
      },
      {
        role: "user",
        content: question
      }
    ];

    console.log("\nStudyBuddy:\n");

    const result = completion({
      modelId,
      history,
      stream: true
    });

    for await (const token of result.tokenStream) {
      process.stdout.write(token);
    }

    console.log("\n");
  }
} catch (error) {
  console.error("Error:", error.message);
} finally {
  rl.close();

  if (modelId) {
    await unloadModel({ modelId });
  }

  console.log("\nGoodbye!");
}