document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const N8N_WEBHOOK_URL = 'https://example.com/n8n-webhook-url'; // <-- TODO: Replace with your actual n8n webhook URL

    const chatContainer = document.getElementById('chat-widget-container');
    const triggerButtons = document.querySelectorAll('.chat-trigger');

    let chatWidget;

    const createChatWidget = () => {
        if (chatContainer.querySelector('#chat-widget')) {
            return;
        }

        chatContainer.innerHTML = `
            <div id="chat-widget">
                <div id="chat-header" class="flex-shrink-0">
                    <div>
                        <h3 class="font-bold text-lg text-slate-900">Asesor Experto</h3>
                        <p class="text-sm text-slate-500">Normalmente responde en segundos</p>
                    </div>
                    <button id="close-chat-button" class="p-2 text-slate-500 hover:text-slate-800 transition-colors">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>
                <div id="chat-messages" class="flex-grow">
                    <div class="bot-message">
                        <p class="chat-bubble">¡Hola! Soy tu asesor tecnológico. ¿Qué producto estás buscando hoy? Por ejemplo, un portátil, un móvil, un televisor...</p>
                    </div>
                </div>
                <div id="chat-form" class="flex-shrink-0">
                    <form id="chat-input-form" class="flex items-center space-x-2">
                        <input type="text" id="chat-input" placeholder="Escribe tu mensaje..." autocomplete="off" class="flex-grow">
                        <button type="submit" class="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors shadow-sm disabled:bg-slate-300">
                            <i data-lucide="send" class="w-5 h-5"></i>
                        </button>
                    </form>
                </div>
            </div>
        `;

        lucide.createIcons({
            nodes: [document.getElementById('close-chat-button'), document.querySelector('#chat-input-form button')]
        });

        chatWidget = document.getElementById('chat-widget');
        const closeButton = document.getElementById('close-chat-button');
        const chatForm = document.getElementById('chat-input-form');
        const chatInput = document.getElementById('chat-input');
        const messagesContainer = document.getElementById('chat-messages');

        closeButton.addEventListener('click', closeChat);
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                addMessage(message, 'user');
                chatInput.value = '';


                addMessage('Estoy analizando tu petición...', 'bot', true);
            }
        });
    };

    const addMessage = (text, sender, isTyping = false) => {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        const bubble = document.createElement('p');
        bubble.className = 'chat-bubble';
        bubble.textContent = text;
        
        if (isTyping) {
            bubble.classList.add('typing-indicator');
        }

        messageDiv.appendChild(bubble);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };


    const openChat = () => {
        createChatWidget();
        setTimeout(() => chatWidget.classList.add('active'), 10);
    };

    const closeChat = () => {
        if (chatWidget) {
            chatWidget.classList.remove('active');
        }
    };

    triggerButtons.forEach(button => {
        button.addEventListener('click', openChat);
    });
});
