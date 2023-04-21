const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

const api_key = "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";

function formatString(str) {
  const lines = str.split('\n');
  const formattedLines = [];
  let isFirstLine = true;

  lines.forEach((line, index) => {
    if (isFirstLine || (line.match(/^[A-Za-z]/))) {
      if (!isFirstLine) {
        formattedLines.push('<br>');
      }
      formattedLines.push('<b>' + line + '</b>\n');
      isFirstLine = false;
    } else if (line.startsWith('-')) {
      formattedLines.push(`\n&bull; ${line.substring(1).trim()}`);
    } else {
      line = line.trim().replace(/([A-Za-z]+)([,.;!?])/g, "$1$2 ");
      formattedLines.push(line);
    }
    if (index !== lines.length - 1) {
      formattedLines.push('\n');
    }
  });

  return formattedLines.join('');
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = `Can you give me the recipe for ${chatInput.value} and give me instructions on how to make it?`;
  const userInput = chatInput.value;
  chatInput.value = "";


 



  chatMessages.innerHTML += `<div class="message user-message">
    <img src="./icons/user.png" alt="user icon"> <span>${ userInput }</span>
  </div>`;

  chatMessages.innerHTML += `<div class="message bot-message">
    <img src="./icons/chatbot.png" alt="bot icon"> 
    <span>Recipe bot is fetching the recipe</span>
  </div>`;

  const dotsMessage = document.querySelector('.bot-message:last-of-type span');
  const intervalId = setInterval(() => {
    dotsMessage.textContent += '.';
    if (dotsMessage.textContent.length === 7) {
      dotsMessage.textContent = 'Recipe bot is fetching the recipe';
    }
  }, 750);

  // Use axios library to make a POST request to the OpenAI API
  const response = await axios.post(
    "https://api.openai.com/v1/completions",
    {
      prompt: message,
      model: "text-davinci-003",
      temperature: 0,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api_key}`,
      },
    }
  );
  
  clearInterval(intervalId);
  
  const chatbotResponse = formatString(response.data.choices[0].text);

  setTimeout(() => {
    const lastBotMessage = document.querySelector('.bot-message:last-of-type');
    lastBotMessage.innerHTML = `<img src="./icons/chatbot.png" alt="bot icon"> 
    ${chatbotResponse.split('\n').map(line => `<span>${line}</span>`).join('')}
    `;
  }, 2000);
});