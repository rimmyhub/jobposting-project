let newMsgs;
let messageList;
let chatContainer;
let chatBoxTitle;
let sent;
let received;
let chattingList;
let chattingContainer;
let alarmIcon;
let msgCard;
const myApplyList = document.getElementById('my-apply-list');
const socket = io('localhost:8080');
const ejs = (window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id');
  const profile = document.getElementById('profile');
  const message = document.getElementById('message-icon');
  const messageBox = document.getElementById('message-box');
  const closeMessage = document.getElementById('close-message');
  const closeChatting = document.getElementById('close-chatting');
  const sendMsgUser = document.getElementById('user-msg');
  const sendBtn = document.getElementById('send-btn');
  const logout = document.getElementById('logout');

  alarmIcon = document.getElementById('exclamation-icon');
  chattingContainer = document.getElementById('chatting-container');
  chattingList = document.getElementById('chatting-list');
  received = document.getElementById('received');
  sent = document.getElementById('sent');
  chatBoxTitle = document.getElementById('chat-box-title');
  chatContainer = document.getElementById('chat-container');
  messageList = document.getElementById('message-list');
  chatContent = document.getElementById('chat-content');

  const id = window.localStorage.getItem('id');
  if (id) {
    socket.emit('saveClientId', id);
  }

  if (logout) {
    logout.addEventListener('click', async () => {
      deleteCookie();
    });
  }
  // 메인페이지에서는 얘가 없어서 오류남
  if (sendMsgUser) {
    // 회사가 유저에게 메세지
    sendMsgUser.addEventListener('click', async () => {
      sendMessageUser(userId);
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
      alarmIcon.style.opacity = 0;
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
    let userEmail;
    let getUserId;
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
      .then((res) => {
        return res.json();
      }) //json으로 받을 것을 명시
      .then((res) => {
        if (res.message) {
          alert(res.message);
        } else {
          getUserId = res.userId;
        }
      });

    await fetch(`/api/users/get-email/${getUserId}`, {
      headers: {
        Accept: 'application / json',
      },
      method: 'GET',
    })
      .then((res) => {
        return res.json();
      }) //json으로 받을 것을 명시
      .then((res) => {
        console.log('res = ', res);
        userEmail = res.email;
      })
      .catch((e) => {
        console.log(e);
      });
    chattingBox(getUserId, userEmail);
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
  // 메세지받기
  socket.on('receive-message', (message, userId, userType) => {
    const type = window.localStorage.getItem('type');
    const myId = window.localStorage.getItem('id');

    if (type !== userType && myId !== userId) {
      alarmIcon.style.opacity = 1;
    }

    builNewMsg(userId, message, userType);
  });

  isLogin();
  async function isLogin() {
    const id = window.localStorage.getItem('id');
    if (id) {
      await checkNewMsg();
      // 새로운 채팅이 있는지 확인하기
      getChatRooms();
    }
  }
});

// 채팅리스트 가져오기
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
  } else if (type === 'company') {
    await fetch('/api/chats/company')
      .then((res) => res.json()) //json으로 받을 것을 명시
      .then((datas) => {
        payload = datas;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  await appendMsgList(payload, type);
  newMsgIcon();
}

// 메세지리스트 화면에 출력하기
async function appendMsgList(datas, type) {
  messageList.innerHTML = '';
  if (type === 'company') {
    datas.forEach((el) => {
      const li = document.createElement('div');
      li.innerHTML = `<div id="message-card-${el.id}" class="message-card" onclick="chattingBox('${el.id}', '${el.user.email}', '${el.userId}')">
                        <div class="user-profile">
                          <img src="/img/userImg.jpg" alt="" srcset="" />
                        </div>
                        <div class="message-info">
                          <div class="user-name">${el.user.email}</div>
                          <div>메세지 확인</div>
                        </div>
                        <i
                          id="exclamation-icon-${el.id}"
                          class="fa-solid fa-exclamation new-msg-alram-icon"
                        ></i>
                      </div>`;
      messageList.append(li);
    });
  } else {
    datas.forEach((el) => {
      const li = document.createElement('div');
      li.innerHTML = `<div id="message-card-${el.id}" class="message-card" onclick="chattingBox('${el.id}', '${el.company.email}', '${el.companyId}')">
                        <div class="user-profile">
                          <img src="/img/userImg.jpg" alt="" srcset="" />
                        </div>
                        <div class="message-info">
                          <div class="user-name">${el.company.email}</div>
                          <div>메세지 확인</div>
                        </div>
                        <i
                          id="exclamation-icon-${el.id}"
                          class="fa-solid fa-exclamation new-msg-alram-icon"
                        ></i>
                      </div>`;
      messageList.append(li);
    });
  }
}

socket.on('msg-notification', async (userId) => {
  console.log('msgNotification', userId);
  const exclamationIcon = document.getElementById('exclamation-icon');
  await checkNewMsg();
  newMsgIcon();
  exclamationIcon.style.opacity = 1;
});

// 채팅리스트안의 새메시지알람표시하기
function newMsgIcon() {
  if (newMsgs) {
    newMsgs.forEach((el) => {
      msgCard = document.getElementById(`exclamation-icon-${el.chat_id}`);
      msgCard.style.opacity = 1;
    });
  }
}

function removeExclamation() {}

// 메세지읽음처리하기
async function readMsg(chatId) {
  const type = window.localStorage.getItem('type');
  if (type === 'user') {
    await fetch(`/api/chat-content/user/${chatId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((e) => {
      console.log(e);
    });
  } else if (type === 'company') {
    await fetch(`/api/chat-content/company/${chatId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((e) => {
      console.log(e);
    });
  }
}

let roomId;
let reciId;
// 채팅창 열기
async function chattingBox(getRoomId, email, recipientId, $event) {
  const messageCard = document.getElementById(
    `${event.target.parentElement.parentElement.id}`,
  );
  const exclamationIcon = messageCard.children[2];
  exclamationIcon.style.opacity = 0;

  console.log('messageCard = ', messageCard);
  reciId = recipientId;
  await readMsg(getRoomId);
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
  await getChatContents(getRoomId);
  // 소켓룸 조인하기
  socket.emit('join', getRoomId);

  roomId = getRoomId;
  chatContainer.style.display = 'flex';
  chattingContainer.scrollTop = chattingContainer.scrollHeight;
}

const handleNewMsg = (senderId, message) => {
  sent.appendChild(builNewMsg(senderId, message));
};

// 메세지뿌리기
const builNewMsg = async (senderId, message, senderType) => {
  const type = window.localStorage.getItem('type');
  const myId = window.localStorage.getItem('id');
  const li = document.createElement('li');
  li.classList.add(
    myId === String(senderId) && senderType === type ? 'sent' : 'received',
  );
  const dom = `<span class="message">${message}</span>`;
  // <span class="time">${sendTime}</span>`;
  li.innerHTML = dom;
  await chattingList.append(li);

  chattingContainer.scrollTop = chattingContainer.scrollHeight;
};

// 새로운 채팅메세지가 있는지 확인하기
async function checkNewMsg() {
  const type = window.localStorage.getItem('type');
  if (type === 'user') {
    await fetch(`/api/chats/check-message/user/${type}`)
      .then((res) => res.json()) //json으로 받을 것을 명시
      .then((datas) => {
        newMsgs = datas;
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    await fetch(`/api/chats/check-message/company/${type}`)
      .then((res) => res.json()) //json으로 받을 것을 명시
      .then((datas) => {
        newMsgs = datas;
      })
      .catch((e) => {
        console.log(e);
      });
  }
  // 유저가 로그인 했을 때 새메세지가 왔음을 알 수 있게 한다.
  if (newMsgs.length) alarmIcon.style.opacity = 1;
}

// 채팅내용가져오기
async function getChatContents(id) {
  await fetch(`/api/chat-content/${id}`)
    .then((res) => res.json()) //json으로 받을 것을 명시
    .then((datas) => {
      datas.forEach((el) => {
        builNewMsg(el.senderId, el.content, el.senderType);
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

// 채팅방에서 나나기
function leaveRoom() {
  chatContainer.style.display = 'none';
  socket.emit('leave', roomId);
  chatBoxTitle.innerHTML = '';
  chattingList.innerHTML = '';
}

// 메세지 보내기
async function sendMessage() {
  const userId = window.localStorage.getItem('id');
  const userType = window.localStorage.getItem('type');
  const payload = {
    userId,
    userType,
    roomId,
  };
  // 메세지 내용 저장하기
  await socket.emit('message', chatContent.value, payload);

  // 소켓 상대방에게 메세지알림 보내기
  socket.emit('msg-notification', reciId);
  chatContent.value = '';
}

// 마이채용공고리스트
if (myApplyList) {
  myApplyList.addEventListener('click', () => {
    const type = window.localStorage.getItem('type');
    location.href = `apply/${type}`;
  });
}
