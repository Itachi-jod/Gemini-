document.getElementById('send-btn').addEventListener('click', function () {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput) {
        addMessage(userInput, 'user-message');
        document.getElementById('user-input').value = '';
        processUserInput(userInput);
    }
});

document.getElementById('user-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('send-btn').click();
    }
});

function addMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', sender);
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Ensure new messages slide in smoothly
    const lastMessage = chatBox.lastChild;
    lastMessage.style.animation = 'slideIn 0.5s ease-out forwards';
}

function typingIndicator() {
    const chatBox = document.getElementById('chat-box');
    const indicator = document.createElement('div');
    indicator.classList.add('chat-message');
    indicator.classList.add('bot-message');
    indicator.innerHTML = `<p>Bot is typing...</p>`;
    chatBox.appendChild(indicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        chatBox.removeChild(indicator);
    }, 2000); // Removes typing indicator after 2 seconds
}

async function processUserInput(query) {
    const lowerQuery = query.toLowerCase();
    typingIndicator();

    // Add sound effect for sending message
    playSound('send');

    if (lowerQuery.includes('price') || lowerQuery.includes('rate') || lowerQuery.includes('how much')) {
        getPrice('btcusd');
    } else if (lowerQuery.includes('trend') || lowerQuery.includes('market')) {
        getMarketTrend();
    } else {
        setTimeout(() => addMessage("Sorry, I didn't understand that. Can you ask something else?", 'bot-message'), 3000);
    }
}

async function getPrice(symbol) {
    setTimeout(async () => {
        try {
            const response = await fetch(`https://api.gemini.com/v1/pubticker/${symbol}`);
            const data = await response.json();
            const message = `The current price of ${symbol.toUpperCase()} is $${data.last}`;
            addMessage(message, 'bot-message');
        } catch (error) {
            console.error('Error fetching price:', error);
            addMessage("Sorry, there was an error fetching the price. Please try again later.", 'bot-message');
        }
    }, 3000);
}

async function getMarketTrend() {
    setTimeout(async () => {
        try {
            const response = await fetch('https://api.gemini.com/v1/pubticker/btcusd');
            const data = await response.json();
            const message = `BTC/USD Market Trend: Price is $${data.last}, 24h Change: ${data.change}%`;
            addMessage(message, 'bot-message');
        } catch (error) {
            console.error('Error fetching market trend:', error);
            addMessage("Sorry, there was an error fetching the market trend. Please try again later.", 'bot-message');
        }
    }, 3000);
}

// Simple sound effect for sending/receiving messages
function playSound(type) {
    const audio = new Audio(type === 'send' ? 'send_message.mp3' : 'receive_message.mp3');
    audio.play();
}
