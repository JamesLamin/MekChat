// ... (rest of the code remains the same)

// Example messages for testing
const addExampleMessages = async () => {
  const messages = [
    { text: 'haiiii', timestamp: Date.now() - 300000, status: 'read' },
    { text: 'aku udh sampee', timestamp: Date.now() - 240000, status: 'read' },
    { text: 'udah sampeeeee??', timestamp: Date.now() - 180000 },
    { text: 'alhamdulillah udaah sampeee', timestamp: Date.now() - 120000 },
    { text: 'tadi ngapain aja sini cerita', timestamp: Date.now() - 60000 },
    { text: 'si konbrut gaya bnr ngmngnya🤣🤣🤣', timestamp: Date.now() - 45000, status: 'read' },
    { text: 'apaan sih orang di aku kecil', timestamp: Date.now() - 30000 },
    { text: 'se jentik', timestamp: Date.now() - 25000 },
    { text: 'muka gw ky gembel😅', timestamp: Date.now() - 20000, status: 'read' },
    { text: 'bejir tobrut banget bangke', timestamp: Date.now() - 15000 },
    { text: 'ko do tutupin stiker siii😡😡😡', timestamp: Date.now() - 10000 },
    { text: 'kan lucuuu', timestamp: Date.now() - 5000 },
    { text: 'sayangggggggg', timestamp: Date.now() }
  ];

  const messageList = document.querySelector('.message-list');
  messageList.innerHTML = '';

  messages.forEach((msg, index) => {
    const isOwn = index % 2 === 1;
    const messageElement = renderMessage(msg, isOwn);
    messageList.appendChild(messageElement);
  });

  messageList.scrollTop = messageList.scrollHeight;
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  await addExampleMessages();

  document.querySelector('.contact-name').textContent = 'Bestie 💕';
  document.querySelector('.contact-status').textContent = 'online';

  // Handle file upload
  const fileInput = document.querySelector('.file-input');
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'x-auth-token': localStorage.getItem('token')
          },
          body: formData
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        console.log('File uploaded:', data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    });
  }
});

// Handle new message input
document.querySelector('.chat-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const input = e.target;
    const text = input.textContent.trim();

    if (text) {
      const message = {
        text,
        timestamp: Date.now(),
        status: 'sent'
      };

      const messageList = document.querySelector('.message-list');
      messageList.appendChild(renderMessage(message, true));
      messageList.scrollTop = messageList.scrollHeight;

      input.textContent = '';

      setTimeout(() => {
        const replies = [
          'iyaaa sayanggg',
          'hmmmm',
          'wkwkwk bisa aja',
          'iya iya betul',
          'lanjut cerita dong',
          '😂😂😂'
        ];

        const reply = {
          text: replies[Math.floor(Math.random() * replies.length)],
          timestamp: Date.now(),
          status: 'read'
        };

        messageList.appendChild(renderMessage(reply, false));
        messageList.scrollTop = messageList.scrollHeight;
      }, 1000);
    }
  }
});

// Handle voice button click
document.querySelector('.voice-button').addEventListener('click', () => {
  const input = document.querySelector('.chat-input');
  const text = input.textContent.trim();

  if (text) {
    const message = {
      text,
      timestamp: Date.now(),
      status: 'sent'
    };

    const messageList = document.querySelector('.message-list');
    messageList.appendChild(renderMessage(message, true));
    messageList.scrollTop = messageList.scrollHeight;

    input.textContent = '';
  }
});

// Message Handling
function renderMessage(message, isOwn = false) {
  const template = document.querySelector('#message-template').content.cloneNode(true);
  const messageElement = template.querySelector('.message');
  const textElement = template.querySelector('.message-text');
  const timeElement = template.querySelector('.message-time');
  const statusElement = template.querySelector('.message-status');

  messageElement.classList.add(isOwn ? 'message-own' : 'message-other');
  textElement.textContent = message.text;

  const time = new Date(message.timestamp);
  timeElement.textContent = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  if (statusElement && message.status) {
    statusElement.classList.add(`status-${message.status}`);
  }

  return template;
}

// Send Message
async function sendMessage() {
  const input = document.querySelector('.chat-input');
  const text = input.innerHTML.trim();

  if (!text && !selectedFile && !recordingVoice) return;

  const messageData = {
    chatId: currentChat,
    content: text,
    replyTo: replyingTo,
    formatting: {
      bold: /font-weight:\s*bold/.test(text),
      italic: /font-style:\s*italic/.test(text),
      strikethrough: /text-decoration:\s*line-through/.test(text),
      monospace: /<code>.*<\/code>/.test(text)
    }
  };

  if (selectedFile) {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-auth-token': authToken },
        body: formData
      });

      const { url, thumbnail } = await response.json();
      messageData.media = {
        url,
        thumbnail,
        type: selectedFile.type,
        name: selectedFile.name,
        size: selectedFile.size
      };
    } catch (error) {
      showResponse(`Error uploading file: ${error.message}`, true);
      return;
    }
  }

  socket.emit('message', messageData);

  // Clear input and reset state
  input.innerHTML = '';
  cancelReply();
  removeFile();
  if (recordingVoice) {
    stopVoiceRecording();
  }
}

// Handle Enter key
document.querySelector('.chat-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Handle send button click
document.querySelector('.voice-button').addEventListener('click', sendMessage);

// Handle received messages
socket.on('message', async (message) => {
  const messageList = document.querySelector('.message-list');
  const isOwn = message.sender._id === currentUser._id;
  const messageElement = renderMessage(message, isOwn);
  messageList.appendChild(messageElement);
  messageList.scrollTop = messageList.scrollHeight;

  // Update message formatting
  const formattingClasses = [];
  if (message.formatting) {
    if (message.formatting.bold) formattingClasses.push('bold');
    if (message.formatting.italic) formattingClasses.push('italic');
    if (message.formatting.strikethrough) formattingClasses.push('strikethrough');
    if (message.formatting.monospace) formattingClasses.push('monospace');
  }
  messageElement.querySelector('.message-content').classList.add(...formattingClasses);

  // Update message media
  if (message.media) {
    const mediaContent = messageElement.querySelector('.message-content');
    const mediaContainer = document.createElement('div');
    mediaContainer.classList.add('media-container');
    mediaContent.appendChild(mediaContainer);

    switch (message.media.type.split('/')[0]) {
      case 'image':
        const img = document.createElement('img');
        img.src = message.media.url;
        img.alt = 'Image';
        mediaContainer.appendChild(img);
        break;
      case 'video':
        const video = document.createElement('video');
        video.src = message.media.url;
        video.controls = true;
        mediaContainer.appendChild(video);
        break;
      case 'audio':
        const audio = document.createElement('audio');
        audio.src = message.media.url;
        audio.controls = true;
        mediaContainer.appendChild(audio);
        break;
      default:
        const file = document.createElement('div');
        file.classList.add('file-message');
        file.innerHTML = `
                    <i class="fas fa-file"></i>
                    <div class="file-info">
                        <div class="file-name">${message.media.name}</div>
                        <div class="file-size">${formatFileSize(message.media.size)}</div>
                    </div>
                    <button onclick="downloadMedia('${message.media.url}', '${message.media.name}')">
                        <i class="fas fa-download"></i>
                    </button>
                `;
        mediaContainer.appendChild(file);
    }
  }

  // Update message reactions
  if (message.reactions && message.reactions.length > 0) {
    const reactionCounts = message.reactions.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {});

    const reactionsContent = document.createElement('div');
    reactionsContent.classList.add('message-reactions');
    messageElement.appendChild(reactionsContent);

    Object.entries(reactionCounts).forEach(([emoji, count]) => {
      const reaction = document.createElement('div');
      reaction.classList.add('reaction');
      reaction.innerHTML = `${emoji} ${count}`;
      reactionsContent.appendChild(reaction);
    });
  }
});

// ... (rest of the code remains the same)
