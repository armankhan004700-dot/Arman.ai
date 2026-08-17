// Update time and date
function updateDateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
    
    document.getElementById('currentTime').textContent = timeStr;
    document.getElementById('currentDate').textContent = dateStr;
}

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        
        // Show selected section
        const sectionId = item.dataset.section;
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
    });
});

// Voice command input
document.getElementById('commandInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendCommand();
    }
});

document.getElementById('sendBtn').addEventListener('click', sendCommand);

function sendCommand() {
    const input = document.getElementById('commandInput');
    const command = input.value.trim();
    
    if (command) {
        console.log('Command:', command);
        addChatMessage('user', command);
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const responses = [
                'I\'ve noted that. Let me process this for you.',
                'That\'s a great task! I\'ll get started right away.',
                'Understood! I\'m working on it.',
                'Perfect! I\'ll take care of that.'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addChatMessage('assistant', randomResponse);
        }, 500);
    }
}

// Chat functionality
document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChat();
    }
});

document.getElementById('sendChatBtn')?.addEventListener('click', sendChat);

function sendChat() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage('user', message);
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const responses = [
                'I understand. Let me help you with that.',
                'That\'s interesting. Here\'s what I think...',
                'I can definitely assist you with this.',
                'Let me process that information.'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addChatMessage('assistant', randomResponse);
        }, 500);
    }
}

function addChatMessage(sender, text) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Voice recording (placeholder)
document.getElementById('recordBtn')?.addEventListener('click', function() {
    this.classList.toggle('recording');
    this.textContent = this.classList.contains('recording') ? 
        '⏹ Stop Recording' : 
        '🎤 Start Recording';
});

// Voice button
document.getElementById('voiceBtn').addEventListener('click', function() {
    this.classList.toggle('active');
});

// Initialize
window.addEventListener('load', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Animate metric circles
    animateMetrics();
});

function animateMetrics() {
    const metrics = document.querySelectorAll('.metric-circle');
    metrics.forEach(metric => {
        const span = metric.querySelector('span');
        const percent = parseInt(span.textContent);
        // Already styled with conic-gradient in CSS
    });
}

// Waveform animation
function createWaveform() {
    const svg = document.querySelector('.waveform-bars');
    if (!svg) return;
    
    const barCount = 60;
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const x = (300 / barCount) * i;
        const height = Math.random() * 60 + 20;
        const y = 50 - height / 2;
        
        bar.setAttribute('x', x);
        bar.setAttribute('y', y);
        bar.setAttribute('width', 300 / barCount - 1);
        bar.setAttribute('height', height);
        bar.setAttribute('fill', `url(#gradient${i % 3 + 1})`);
        bar.setAttribute('opacity', '0.8');
        bar.setAttribute('rx', '2');
        bar.style.animation = `barAnimation ${0.5 + Math.random() * 0.5}s ease-in-out infinite`;
        bar.style.animationDelay = `${i * 0.02}s`;
        
        svg.appendChild(bar);
    }
}

// Add CSS animation for bars
const style = document.createElement('style');
style.textContent = `
    @keyframes barAnimation {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(1.5); }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize waveform
window.addEventListener('load', createWaveform);

// API Integration (example)
async function makeApiCall(endpoint, data) {
    try {
        const response = await fetch(`http://localhost:3000${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// Example: Ask question
async function askArmanAI(question) {
    const response = await makeApiCall('/api/ask', { question });
    if (response) {
        console.log('Response:', response);
        addChatMessage('assistant', response.answer);
    }
}
