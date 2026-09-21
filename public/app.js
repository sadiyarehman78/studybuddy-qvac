const chatArea = document.getElementById("chatArea");
const chatForm = document.getElementById("chatForm");
const questionInput = document.getElementById("question");
const sendButton = document.getElementById("sendButton");
const newChatButton = document.getElementById("newChat");

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

  avatar.textContent =
    type === "user" ? "You" : "✦";

  const content = document.createElement("div");

  content.className = "message-content";

  content.textContent = text;

  message.appendChild(avatar);
  message.appendChild(content);

  chatArea.appendChild(message);

  chatArea.scrollTop = chatArea.scrollHeight;

  return content;
}


async function askStudyBuddy(question) {

  removeWelcome();

  addMessage(question, "user");

  const answerElement = addMessage(
    "Thinking...",
    "ai"
  );

  sendButton.disabled = true;
  questionInput.disabled = true;

  try {

    const response = await fetch("/api/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        question
      })

    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    answerElement.textContent = "";

    const reader =
      response.body.getReader();

    const decoder =
      new TextDecoder();

    while (true) {

      const { value, done } =
        await reader.read();

      if (done) break;

      const chunk =
        decoder.decode(value, {
          stream: true
        });

      answerElement.textContent += chunk;

      chatArea.scrollTop =
        chatArea.scrollHeight;
    }

  } catch (error) {

    answerElement.textContent =
      "Sorry, something went wrong. Please try again.";

    console.error(error);

  } finally {

    sendButton.disabled = false;
    questionInput.disabled = false;

    questionInput.focus();
  }
}


chatForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    const question =
      questionInput.value.trim();

    if (!question) return;

    questionInput.value = "";

    await askStudyBuddy(question);
  }
);


questionInput.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      chatForm.requestSubmit();
    }
  }
);


document
  .querySelectorAll(".suggestion")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const question =
          button.dataset.question;

        askStudyBuddy(question);
      }
    );
  });


newChatButton.addEventListener(
  "click",
  () => {

    window.location.reload();

  }
);