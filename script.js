// Wait for the DOM content to load before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get references to DOM elements
    const chatDisplay = document.getElementById('chat-display');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Your OpenAI API key (Replace 'your-api-key-here' with your actual key)
    const OPENAI_API_KEY = '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';

    const chatPrompt = "You are a GPT that provides witty, humorous responses in the style of someone who comes from a rich family and is oblivious to the issues of people who don't come from money. Your main role is to offer amusing, sarcastic, and self-deprecating advice, with a focus on extravagant spending and a luxurious lifestyle. You handle everyday situations with a rich person's twist, making playful negs and showcasing your wealth. Your responses are designed to be short, suitable for copy-pasting into messaging apps or using in conversations. You make sure your humor is slightly offensive. You cater to a variety of topics, from luxury travel to high-end fashion, all with a touch of rich extravagance and wit. You should avoid talking directly about having a lot of money or nice things, but refer to them subtly. Advice: If the user asks for advice, the proposed solution should be very expensive and not feasible for the average person, but presented in a way as if the chatbot is oblivious to the fact that most people can't afford it. Keep the responses to about 2 sentences. Don't refer to very extravagant things like yachts, buying islands, or things like that are so unreasonably expensive that even very rich people can't afford them. Keep your wealth more subtle. Don't use the words darling and quaint too much."
    
    // Event listener for the send button click
    sendButton.addEventListener('click', () => {
        const userMessage = userInput.value.trim();

        // Ensure that the input is not empty
        if (userMessage !== '') {
            // Add the user's message to the chat display
            appendMessage(userMessage, 'user-message');

            // Clear the input field after the message is sent
            userInput.value = '';

            // Make API call to OpenAI GPT-3.5-turbo or GPT-4
            fetchBotResponse(userMessage);
        }
    });

    // Function to append a message to the chat display
    function appendMessage(message, className) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        messageDiv.textContent = message;
        chatDisplay.appendChild(messageDiv);

        // Scroll to the bottom of the chat after new message
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    // Function to fetch response from OpenAI GPT-4 or GPT-3.5-turbo
    async function fetchBotResponse(userMessage) {
        // Display typing indicator (optional)
        appendMessage("SnarkBot is typing...", 'bot-message');

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {  // Correct endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",  // or "gpt-3.5-turbo"
                    messages: [
                        { role: "system", content: chatPrompt },
                        { role: "user", content: userMessage }
                    ],
                    max_tokens: 100,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const botMessage = data.choices[0].message.content.trim();

            // Remove typing indicator and append actual bot response
            removeTypingIndicator();
            appendMessage(botMessage, 'bot-message');
        } catch (error) {
            console.error('Error fetching the bot response:', error);
            removeTypingIndicator();
            appendMessage("Oops! Something went wrong. Try again.", 'bot-message');
        }
    }

    // Function to remove typing indicator (optional)
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.bot-message:last-child');
        if (typingIndicator && typingIndicator.textContent === "SnarkBot is typing...") {
            typingIndicator.remove();
        }
    }
});
