let messageList;
let chatContainer;
let chatBoxTitle;
let sent;
let received;
let chattingList;
let chattingContainer;
// let alarmIcon;
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
  const alarmIcon = document.getElementById('exclamation-icon');

  chattingContainer = document.getElementById('chatting-container');
  chattingList = document.getElementById('chatting-list');
  received = document.getElementById('received');
  sent = document.getElementById('sent');
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
  socket.on('receive-message', (message, userId, userType) => {
    // const type = window.localStorage.getItem('type');
    // console.log(message, userId, userType);
    // if (type !== userType) {
    //   alarmIcon.style.opacity = 1;
    // }
    builNewMsg(userId, message, userType);
  });

  isLogin();
});

function isLogin() {
  const id = window.localStorage.getItem('id');
  if (id) {
    getChatRooms();
    // 새로운 채팅이 있는지 확인하기
    checkNewMsg();
  }
}

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
  appendMsgList(payload, type);
}

// 메세지리스트 화면에 출력하기
function appendMsgList(datas, type) {
  if (type === 'company') {
    datas.forEach((el) => {
      const li = document.createElement('div');
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
// 채팅창 열기
async function chattingBox(id, email) {
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
  await getChatContents(id);
  socket.emit('join', id);
  roomId = id;
  chatContainer.style.display = 'flex';
  chattingContainer.scrollTop = chattingContainer.scrollHeight;
}

const handleNewMsg = (senderId, message) => {
  sent.appendChild(builNewMsg(senderId, message));
};

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
        console.log(datas);
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    await fetch(`/api/chats/check-message/company/${type}`)
      .then((res) => res.json()) //json으로 받을 것을 명시
      .then((datas) => {
        console.log(datas);
      })
      .catch((e) => {
        console.log(e);
      });
  }
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
  chatContent.value = '';
}

// 마이채용공고리스트
myApplyList.addEventListener('click', () => {
  const type = window.localStorage.getItem('type');
  location.href = `apply/${type}`;
});
