//appendBotMessage.js
// 这个函数用于将机器人回复的消息添加到聊天容器中
function appendBotMessage(chatContainer, message) {
    // 创建一个新的div元素作为消息的容器
    const messageWrapper = document.createElement('div');
    // 为消息容器添加CSS类，设置为机器人消息
    messageWrapper.classList.add('message-wrapper', 'bot-message-wrapper');
    
    // 创建一个新的div元素作为消息内容
    const botMessageElement = document.createElement('div');
    // 为消息内容添加CSS类，设置为机器人消息
    botMessageElement.classList.add('message', 'bot-message');

    // 如果消息是对象类型，则将其转换为字符串后显示
    if (typeof message === 'object') {
        botMessageElement.textContent = JSON.stringify(message);
    } else {
        // 如果消息是字符串类型，则直接显示
        botMessageElement.textContent = message;
    }
    
    // 将消息内容添加到消息容器中
    messageWrapper.appendChild(botMessageElement);
    // 将消息容器添加到聊天容器中
    chatContainer.appendChild(messageWrapper);
}



/////////////////////////////////////
//eventListeners.js
// 监听 Enter 键，发送消息
document.getElementById('input-message').addEventListener('keypress', function(event) {
    // 当按下的键是 Enter 时执行
    if (event.key === 'Enter') {
        // 获取输入框元素
        const inputElement = document.getElementById('input-message');
        // 获取输入框中的消息内容，并去除首尾空格
        const message = inputElement.value.trim();
        // 如果消息不为空，则发送消息
        if (message !== '') {
            sendMessage(message);
            // 发送后清空输入框
            inputElement.value = '';
        }
    }
});

// 监听发送按钮点击事件，发送消息
document.getElementById('send-button').addEventListener('click', function() {
    // 获取输入框元素
    const inputElement = document.getElementById('input-message');
    // 获取输入框中的消息内容，并去除首尾空格
    const message = inputElement.value.trim();
    // 如果消息不为空，则发送消息
    if (message !== '') {
        sendMessage(message);
        // 发送后清空输入框
        inputElement.value = '';
    }
});





//////////////////////////////////////
//fetchBaiduResponse.js
// 异步函数，用于获取百度ERNIE模型的接口回复
async function fetchBaiduResponse(message) {
    // 访问令牌，用于授权访问百度接口
    const access_token = '24.4feac2f08c77258fa55f44bd158e4c67.2592000.1721640392.282335-70727787';
    // 百度接口的URL
    const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/yi_34b_chat?access_token=${access_token}`;
    // 请求体，包含用户消息
    const body = JSON.stringify({
        "messages": [
            {
                "role": "user",
                "content": message
            },
        ],
        //"stream": true
        //"user_id": "my_useridddd",
        //"response_format": "json_object"
    });
    // 请求头，指定内容类型为JSON
    const headers = {
        'Content-Type': 'application/json'
    };
    // 发送POST请求并等待响应
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
    });
    // 返回响应的JSON格式
    return response.json();
}



//////////////////////////////////////
//sendMessage.js
// 这个函数用于发送用户的消息，并获取机器人的回复
function sendMessage(message) {
    // 获取聊天容器元素
    const chatContainer = document.getElementById('chat-container');

    // 创建一个新的div元素作为用户消息的容器
    const messageWrapper = document.createElement('div');
    // 为消息容器添加CSS类，设置为用户消息
    messageWrapper.classList.add('message-wrapper', 'user-message-wrapper');

    // 创建一个新的div元素作为用户消息内容
    const userMessageElement = document.createElement('div');
    // 为消息内容添加CSS类，设置为用户消息
    userMessageElement.classList.add('message', 'user-message');
    // 设置消息内容为用户输入的消息
    userMessageElement.textContent = message;

    // 检查聊天容器是否滚动到底部
    const scrollToBottom = chatContainer.scrollHeight - chatContainer.clientHeight === chatContainer.scrollTop;

    // 将用户消息添加到消息容器中，并将消息容器添加到聊天容器中
    messageWrapper.appendChild(userMessageElement);
    chatContainer.appendChild(messageWrapper);

    // 如果聊天容器滚动到底部，则保持滚动到底部状态
    if (scrollToBottom) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } else {
        // 如果没有滚动到底部，也将聊天容器滚动到底部
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // 调用函数获取百度接口的回复
    fetchBaiduResponse(message)
        .then(response => {
            // 获取回复后，将回复消息添加到聊天容器中
            appendBotMessage(chatContainer, response.result);
        })
        .catch(error => console.error('Error fetching Baidu response:', error)); // 捕捉并输出错误
}



