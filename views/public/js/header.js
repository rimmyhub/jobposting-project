let messageList;
let chatContainer;
let chatBoxTitle;
const socket = io('http://localhost:8080');
const ejs = (window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id');
  const profile = document.getElementById('profile');
  const message = document.getElementById('message-icon');
  const messageBox = document.getElementById('message-box');
  const messageCard = document.getElementById('message-card');
  const closeMessage = document.getElementById('close-message');
  const closeChatting = document.getElementById('close-chatting');
  const sendMsgUser = document.getElementById('user-msg');
  const sendBtn = document.getElementById('send-btn');
  const sent = document.getElementById('sent');
  const logout = document.getElementById('logout');

  chatBoxTitle = document.getElementById('chat-box-title');
  chatContainer = document.getElementById('chat-container');
  messageList = document.getElementById('message-list');
  chatContent = document.getElementById('chat-content');

  if (logout) {
    logout.addEventListener('click', async () => {
      deleteCookie();
    });
  }
  // 메인페이지에서는 얘가 없어서 오류남
  if (sendMsgUser) {
    // 회사가 유저에게 메세지
    sendMsgUser.addEventListener('click', () => {
      sendMessageUser(userId);
      chatContainer.style.display = 'flex';
    });
  }
  if (profile) {
    profile.addEventListener('click', () => {
      location.href = '/mypage';
    });
  }

  if (message) {
    message.addEventListener('click', () => {
      messageBox.style.display = 'block';
    });
  }
  if (messageCard) {
    messageCard.addEventListener('click', () => {
      chatContainer.style.display = 'flex';
    });
  }

  if (closeMessage) {
    closeMessage.addEventListener('click', (event) => {
      messageBox.style.display = 'none';
      event.stopPropagation();
    });
  }

  if (closeChatting) {
    closeChatting.addEventListener('click', () => {
      // chatContainer.style.display = 'none';
      leaveRoom();
    });
  }

  // 방 생성하기
  const sendMessageUser = async () => {
    // 방 이름을 어떻게 할까?
    // 1. DB에 나와 상대방의 ID와 방의 ID를 임시로 만들어서 저장한다.

    // 내 아이디
    const id = window.localStorage.getItem('id');
    // 2.

    await fetch(`/api/chats/company/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json()) //json으로 받을 것을 명시
      .then((res) => {
        //실제 데이터를 상태변수에 업데이트
        console.log('res = ', res);
      });
  };

  const handleNewMsg = (message) => {
    sent.appendChild(builNewMsg(message));
  };

  const builNewMsg = (message) => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(message));
    return li;
  };

  async function deleteCookie() {
    let isSuccess;
    await fetch('/api/auth/logout', {
      method: 'DELETE',
    })
      .then((el) => {
        isSuccess = el.ok;
      })
      .catch((e) => {
        console.log(e);
      });
    if (isSuccess) {
      window.localStorage.removeItem('id');
      window.localStorage.removeItem('type');
      location.href = '/';
    }
  }

  if (sendBtn) {
    // 메세지 버튼
    sendBtn.addEventListener('click', () => {
      sendMessage();
    });
  }

  socket.on('receive-message', (message) => {
    console.log('message = ', message);
    handleNewMsg(message);
  });

  isLogin();
});

function isLogin() {
  const id = window.localStorage.getItem('id');
  if (id) {
    getChatRooms();
  }
}

async function getChatRooms() {
  let type = window.localStorage.getItem('type');
  let payload;
  if (type === 'user') {
    await fetch('/api/chats/user')
      .then((res) => res.json()) //json으로 받을 것을 명시
      .then((datas) => {
        payload = datas;
      })
      .catch((e) => {
        console.log(e);
      });

    appendMsgList(payload);
  } else if (type === 'company') {
    await fetch('/api/chats/company')
      .then((res) => res.json()) //json으로 받을 것을 명시
      .then((datas) => {
        payload = datas;
      })
      .catch((e) => {
        console.log(e);
      });
    appendMsgList(payload, type);
  }
}

function appendMsgList(datas, type) {
  if (type === 'company') {
    datas.forEach((el) => {
      const li = document.createElement('div');
      console.log('el = ', el);
      li.innerHTML = `<div id="message-card" class="message-card" onclick="chattingBox('${el.id}', '${el.user.email}')">
                        <div class="user-profile">
                          <img src="/img/userImg.jpg" alt="" srcset="" />
                        </div>
                        <div class="message-info">
                          <div class="user-name">${el.user.email}</div>
                          <div>메세지 확인</div>
                        </div>
                      </div>`;
      messageList.append(li);
    });
  } else {
    datas.forEach((el) => {
      const li = document.createElement('div');
      console.log('el = ', el);
      li.innerHTML = `<div id="message-card" class="message-card" onclick="chattingBox('${el.id}', '${el.company.email}')">
                        <div class="user-profile">
                          <img src="/img/userImg.jpg" alt="" srcset="" />
                        </div>
                        <div class="message-info">
                          <div class="user-name">${el.company.email}</div>
                          <div>메세지 확인</div>
                        </div>
                      </div>`;
      messageList.append(li);
    });
  }
}

let roomId;
function chattingBox(id, email) {
  const userName = document.createElement('h6');
  userName.innerText = `${email} 님`;
  chatBoxTitle.append(userName);

  // icon변수에 i태그의 요소와  id를 추가
  const icon = Object.assign(document.createElement('i'), {
    id: 'close-chatting',
  });

  // icon에 className을 추가
  icon.className = 'fa-solid fa-xmark close-message';
  icon.onclick = leaveRoom;

  chatBoxTitle.append(icon);

  socket.emit('join', id);
  roomId = id;
  chatContainer.style.display = 'flex';
}

function leaveRoom() {
  chatContainer.style.display = 'none';
  socket.emit('leave', roomId);
  chatBoxTitle.innerHTML = '';
}

// 메세지 보내기
function sendMessage() {
  // 메세지 내용 저장하기

  socket.emit('message', chatContent.value, roomId);
  chatContent.value = '';
}
