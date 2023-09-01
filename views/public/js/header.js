let messageList;
let chatContainer;
const socket = io('http://localhost:8080');
const ejs = (window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id');
  const profile = document.getElementById('profile');
  const message = document.getElementById('message-icon');
  const messageBox = document.getElementById('message-box');
  const messageCard = document.getElementById('message-card');
  chatContainer = document.getElementById('chat-container');
  const closeMessage = document.getElementById('close-message');
  const closeChatting = document.getElementById('close-chatting');
  const sendMsgUser = document.getElementById('user-msg');
  const sendBtn = document.getElementById('send-btn');
  chatContent = document.getElementById('chat-content');
  const sent = document.getElementById('sent');
  messageList = document.getElementById('message-list');
  const logout = document.getElementById('logout');

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
      console.log('채팅창 닫기');
      chatContainer.style.display = 'none';
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
      alert('로그아웃 되었습니다.');
      location.href = '/';
    }
  }

  if (sendBtn) {
    // 메세지 버튼
    sendBtn.addEventListener('click', () => {
      console.log('sendBtn');
      sendMessage();
    });
  }

  socket.on('receive-message', (message) => {
    handleNewMsg(message);
  });

  getChatRooms();
});

async function getChatRooms() {
  let type = window.localStorage.getItem('type');
  let payload;
  console.log('type = ', type);
  if (type === 'user') {
    await fetch('/api/chats/user')
      .then((res) => res.json()) //json으로 받을 것을 명시
      .then((datas) => {
        console.log('getChat User', datas);
        payload = datas;
      })
      .catch((e) => {
        console.log(e);
      });
    console.log('payload = ', payload);
    appendMsgList(payload);
  } else if (type === 'company') {
    await fetch('/api/chats/company')
      .then((res) => res.json()) //json으로 받을 것을 명시
      .then((datas) => {
        console.log('datas', datas);
        payload = datas;
      })
      .catch((e) => {
        console.log(e);
      });
    console.log('payload = ', payload);
    appendMsgList(payload, type);
  }
}

function appendMsgList(datas, type) {
  if (type === 'company') {
    datas.forEach((el) => {
      const li = document.createElement('div');
      console.log('el = ', el);
      li.innerHTML = `<div id="message-card" class="message-card" onclick="chattingBox(${el.id})">
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
      li.innerHTML = `<div id="message-card" class="message-card" onclick="chattingBox(${el.id})">
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
function chattingBox(param) {
  socket.emit('join', param);
  roomId = param;
  chatContainer.style.display = 'flex';
}

function sendMessage() {
  socket.emit('message', chatContent.value, roomId);
}
