// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DOM Element Selection ---
    // Select all the interactive elements from the HTML file.
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatLog = document.getElementById('chat-log');
    const welcomeScreen = document.getElementById('welcome-screen');
    const promptCards = document.querySelectorAll('.prompt-card');
    const newChatBtn = document.getElementById('new-chat-btn');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('main'); // Reference to the main element

    // --- 2. State Management ---
    // This array will store the conversation history to maintain context with the AI.
    let chatHistory = [];

    // --- 3. UI Event Listeners ---

    // Automatically resize the textarea as the user types.
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto'; // Reset height
        chatInput.style.height = (chatInput.scrollHeight) + 'px'; // Set to scroll height
    });

    // Toggle the sidebar for mobile view.
    const toggleSidebar = () => {
        // Toggle the 'active' class which handles the transform in CSS
        sidebar.classList.toggle('active');

        // Prevent body scrolling when sidebar is open on mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : 'auto';
        }
    };

    menuToggle.addEventListener('click', toggleSidebar);

    // Close sidebar if clicking outside when open on mobile
    mainContent.addEventListener('click', (event) => {
        // Check if the sidebar is active (open on mobile), the window is small enough,
        // and the click occurred outside the sidebar and the menu toggle button.
        if (sidebar.classList.contains('active') && window.innerWidth <= 768 &&
            !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            toggleSidebar(); // Close sidebar
        }
    });


    // Start a new chat session.
    newChatBtn.addEventListener('click', () => {
        chatLog.innerHTML = ''; // Clear the chat log
        welcomeScreen.style.display = 'flex'; // Show the welcome screen
        chatLog.style.display = 'none'; // Hide the chat log
        chatHistory = []; // Reset the conversation history
        chatInput.value = ''; // Clear input field
        chatInput.style.height = 'auto'; // Reset textarea height

        // If sidebar is open on mobile, close it
        if (sidebar.classList.contains('active') && window.innerWidth <= 768) {
            toggleSidebar();
        }
    });

    // When a prompt card is clicked, populate the input field with its text.
    promptCards.forEach(card => {
        card.addEventListener('click', () => {
            const promptText = card.dataset.prompt;
            chatInput.value = promptText;
            chatInput.focus();
            // Trigger the input event manually to resize the textarea.
            chatInput.dispatchEvent(new Event('input'));
        });
    });

    // --- 4. Core Chat Logic ---

    // Handle the form submission when the user sends a message.
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the default form submission (page reload).
        const userMessage = chatInput.value.trim();

        if (!userMessage) return; // Don't send empty messages.

        // On the first message, hide the welcome screen and ensure chat log is visible.
        if (welcomeScreen.style.display !== 'none') {
            welcomeScreen.style.display = 'none';
            chatLog.style.display = 'flex'; // Ensure chatLog is visible
        }

        // Add the user's message to the UI and history.
        appendMessage('user', userMessage);
        chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

        // Clear the input field and reset its height.
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Show the typing indicator and fetch the AI's response.
        showTypingIndicator();
        generateAiResponse();
    });

    /**
     * Creates and appends a new message bubble to the chat log.
     * @param {string} sender - 'user' or 'ai'.
     * @param {string} message - The message content.
     */
    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        // Sanitize the message to prevent HTML injection.
        const sanitizedMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        // Convert newlines to <br> tags for proper display.
        const formattedMessage = sanitizedMessage.replace(/\n/g, '<br>');

        let avatarHtml, messageContentHtml;

        if (sender === 'user') {
            // User message HTML structure (matching CSS classes)
            avatarHtml = `<img src="https://placehold.co/40x40/7e22ce/ffffff?text=U" alt="User" class="user-avatar">`;
            messageContentHtml = `<div class="message-bubble">${formattedMessage}</div>`;
            messageElement.classList.add('chat-message', 'user');
            messageElement.innerHTML = `<div class="message-content">${messageContentHtml}</div><div class="avatar-wrapper">${avatarHtml}</div>`;
        } else { // AI
            // AI message HTML structure (matching CSS classes)
            avatarHtml = `<div class="ai-avatar-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
                          </div>`;
            messageContentHtml = `<div class="message-bubble">${formattedMessage}</div>`;
            messageElement.classList.add('chat-message', 'ai');
            messageElement.innerHTML = `<div class="avatar-wrapper">${avatarHtml}</div><div class="message-content">${messageContentHtml}</div>`;
        }

        chatLog.appendChild(messageElement);
        // Automatically scroll to the latest message.
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    /**
     * Displays a "typing..." animation in the chat log.
     */
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.classList.add('chat-message', 'ai', 'typing'); // Use existing chat-message class for layout consistency
        typingElement.innerHTML = `
            <div class="avatar-wrapper">
                <div class="ai-avatar-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
                </div>
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="dot-flashing"></div>
                </div>
            </div>`;
        chatLog.appendChild(typingElement);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    /**
     * Removes the "typing..." animation from the chat log.
     */
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // --- 5. Gemini API Integration ---
    /**
     * Fetches a response from the Gemini API based on the current chat history.
     */
    async function generateAiResponse() {
        // Use the API key provided by the user in the previous conversation.
        const apiKey = "";
        const apiUrl = ``;

        const payload = { contents: chatHistory };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // Handle API errors (e.g., 4xx or 5xx status codes).
                const errorData = await response.json();
                console.error("API Error:", errorData);
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            
            // Safely access the response text.
            const aiMessage = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (aiMessage) {
                // Add the AI's message to the UI and history.
                removeTypingIndicator();
                appendMessage('ai', aiMessage);
                chatHistory.push({ role: "model", parts: [{ text: aiMessage }] });
            } else {
                // Handle cases where the response structure is unexpected.
                throw new Error("Invalid response structure from API.");
            }

        } catch (error) {
            console.error("Error fetching AI response:", error);
            removeTypingIndicator();
            // Display a user-friendly error message in the chat.
            appendMessage('ai', "I'm sorry, but I encountered an error while trying to respond. Please check the console for details and try again.");
        }
    }

    // --- Initial State Setup ---
    // On page load, if chat log is empty, show welcome screen. Otherwise, ensure chat log is visible.
    if (chatLog.children.length === 0) {
        welcomeScreen.style.display = 'flex';
        chatLog.style.display = 'none';
    } else {
        welcomeScreen.style.display = 'none';
        chatLog.style.display = 'flex';
    }
});
function addMessage(role, content) {
  const messageEl = document.createElement("div");
  messageEl.classList.add("chat-message");
  if (role === "user") {
    messageEl.classList.add("user");
  }
  messageEl.textContent = content;

  const chatContainer = document.getElementById("chat-container");
  chatContainer.appendChild(messageEl);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
