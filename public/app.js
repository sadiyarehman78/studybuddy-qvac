const chatArea = document.getElementById("chatArea");
const chatForm = document.getElementById("chatForm");
const questionInput = document.getElementById("question");
const sendButton = document.getElementById("sendButton");
const newChatButton = document.getElementById("newChat");

let controller = null;
let isGenerating = false;

function removeWelcome() {
  const welcome = document.getElementById("welcome");

  if (welcome) {
    welcome.remove();
  }
}

function addMessage(text, type) {
  const message = document.createElement("div");

  message.className = `message ${type}-message`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = type === "user" ? "You" : "✦";

  const content = document.createElement("div");
  content.className = "message-content";
  content.textContent = text;

  message.appendChild(avatar);
  message.appendChild(content);

  chatArea.appendChild(message);

  chatArea.scrollTop = chatArea.scrollHeight;

  return content;
}

function setGenerating(state) {
  isGenerating = state;

  if (state) {
    // Arrow becomes Stop
    sendButton.textContent = "■";
    sendButton.classList.add("stop-button");
    sendButton.setAttribute("aria-label", "Stop generating");
  } else {
    // Stop becomes Arrow
    sendButton.textContent = "↑";
    sendButton.classList.remove("stop-button");
    sendButton.setAttribute("aria-label", "Send");
  }
}

function stopGenerating() {
  if (controller) {
    controller.abort();
    controller = null;
  }

  setGenerating(false);

  questionInput.disabled = false;
  sendButton.disabled = false;

  questionInput.focus();
}

async function askStudyBuddy(question) {
  removeWelcome();

  addMessage(question, "user");

  const answerElement = addMessage(
    "Thinking...",
    "ai"
  );

  controller = new AbortController();

  setGenerating(true);

  questionInput.disabled = true;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        question
      }),

      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    answerElement.textContent = "";

    const reader = response.body.getReader();

    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, {
        stream: true
      });

      answerElement.textContent += chunk;

      chatArea.scrollTop = chatArea.scrollHeight;
    }

  } catch (error) {

    if (error.name === "AbortError") {
      // User intentionally stopped generation.
      answerElement.textContent += "\n\n[Generation stopped]";
    } else {
      console.error(error);

      answerElement.textContent =
        "Sorry, something went wrong. Please try again.";
    }

  } finally {
    controller = null;

    setGenerating(false);

    questionInput.disabled = false;

    questionInput.focus();
  }
}


chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // If AI is generating, the arrow/stop button stops it.
  if (isGenerating) {
    stopGenerating();
    return;
  }

  const question = questionInput.value.trim();

  if (!question) return;

  questionInput.value = "";

  await askStudyBuddy(question);
});


questionInput.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    !event.shiftKey
  ) {
    event.preventDefault();

    chatForm.requestSubmit();
  }
});


document
  .querySelectorAll(".suggestion")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.dataset.question;

      askStudyBuddy(question);
    });
  });


newChatButton.addEventListener("click", () => {
  if (isGenerating) {
    stopGenerating();
  }

  window.location.reload();
});