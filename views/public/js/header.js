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
let offer;
const myApplyList = document.getElementById('my-apply-list');
const myProfile = document.getElementById('profile-image');

const socket = io('localhost:3030');
const ejs = (window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id');
  const profile = document.getElementById('profile');
  const message = document.getElementById('message-icon');
  const messageBox = document.getElementById('message-box');
  const closeMessage = document.getElementById('close-message');
  const closeChatting = document.getElementById('close-chatting');
  const sendMsg = document.getElementById('send-msg');
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
  const type = window.localStorage.getItem('type');
  const id = window.localStorage.getItem('id');
  if (id) {
    const payload = {
      type,
      userId: id,
    };
    socket.emit('saveClientId', payload);
  }

  if (logout) {
    logout.addEventListener('click', async () => {
      deleteCookie();
    });
  }
  // 메인페이지에서는 얘가 없어서 오류남
  if (sendMsg) {
    // 회사가 유저에게 메세지
    sendMsg.addEventListener('click', async () => {
      sendMessageUser(userId);
    });
  }
  if (profile) {
    profile.addEventListener('click', () => {
      let type = window.localStorage.getItem('type');
      if (type === 'user') {
        location.href = '/mypage';
      } else if (type === 'company') {
        location.href = '/mypage/company';
      }
      console.error('Invalid type:', type);
    });
  }

  // 이미지 화면에 표시하기
  if (myProfile) {
    async function getImage() {
      try {
        let type = window.localStorage.getItem('type');
        let imageUrl;
        if (type === 'user') {
          const response = await fetch('/api/users/user-page', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('이미지 가져오기 실패');
          }
          const data = await response.json();

          imageUrl = data.image; // 가져온 이미지 URL
        } else if (type === 'company') {
          const response = await fetch('/api/companies/company', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('이미지 가져오기 실패');
          }
          const data = await response.json();
          imageUrl = data.image; // 가져온 이미지 URL
        }

        // 이미지 화면에 표시하기
        myProfile.src = imageUrl; // 이미지 URL을 설정하여 이미지를 표시
      } catch (error) {
        console.error('이미지 가져오기 오류:', error);
      }
    }

    // 이미지 가져오기 함수 호출
    getImage();
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
    const companyId = document.location.href.split('/')[4];
    console.log('companyId = ', companyId);
    // 방 이름을 어떻게 할까?
    // 1. DB에 나와 상대방의 ID와 방의 ID를 임시로 만들어서 저장한다.
    // 내 아이디
    let continueChat = true;
    let roomId;
    let getUserId;
    let name;

    const type = window.localStorage.getItem('type');

    // 2.
    if (type === 'company') {
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

            continueChat = false;
          } else {
            console.log('res =', res);
            getUserId = res.userId;
            roomId = res.id;
            name = res.user.name;
          }
        });
    } else {
      await fetch(`/api/chats/user/${companyId}`, {
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
            continueChat = false;
          } else {
            console.log('res =', res);
            getUserId = res.userId;
            roomId = res.id;
            name = res.company.title;
          }
        });
    }

    if (continueChat) {
      await chattingBox(roomId, name, getUserId);
      getChatRooms();
    }
  };

  async function deleteCookie() {
    const id = window.localStorage.getItem('id');
    console.log('id', id);
    let isSuccess;
    await fetch('/api/auth/logout', {
      method: 'DELETE',
      body: id,
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
      // 새로운 채팅이 있는지 확인하기
      await getChatRooms();
      await checkNewMsg();
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
  if (messageList !== null) {
    messageList.innerHTML = '';
    if (type === 'company') {
      datas.forEach((el) => {
        const li = document.createElement('div');
        li.innerHTML = `<div id="message-card-${el.id}" class="message-card" onclick="chattingBox('${el.id}', '${el.user.name}', '${el.userId}')">
                          <div class="user-profile">
                            <img src="/img/userImg.jpg" alt="" srcset="" />
                          </div>
                          <div class="message-info">
                            <div class="user-name">${el.user.name}</div>
                            <div>메세지 확인</div>
                          </div>
                          <i
                            id="${el.id}"
                            class="fa-solid fa-exclamation new-msg-alram-icon"
                          ></i>
                        </div>`;
        messageList.append(li);
      });
    } else {
      datas.forEach((el) => {
        const li = document.createElement('div');
        li.innerHTML = `<div id="message-card-${el.id}" class="message-card" onclick="chattingBox('${el.id}', '${el.company.title}', '${el.companyId}')">
                          <div class="user-profile">
                            <img src="/img/userImg.jpg" alt="" srcset="" />
                          </div>
                          <div class="message-info">
                            <div class="user-name">${el.company.title}</div>
                            <div>메세지 확인</div>
                          </div>
                          <i
                            id="${el.id}"
                            class="fa-solid fa-exclamation new-msg-alram-icon"
                          ></i>
                        </div>`;
        messageList.append(li);
      });
    }
  }
}

socket.on('msg-notification', async () => {
  const exclamationIcon = document.getElementById('exclamation-icon');
  await checkNewMsg();
  exclamationIcon.style.opacity = 1;
});

// 채팅리스트안의 새메시지알람표시하기
function newMsgIcon(params) {
  // console.log('newMsgs = ', params);
  if (params) {
    params.forEach((el) => {
      console.log(el);
      msgCard = document.getElementById(`${el.chat_id}`);
      msgCard.style.opacity = 1;
    });
  }
}

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
//  chattingBox(getUserId, userEmail);
async function chattingBox(getRoomId, name, recipientId, $event) {
  const cameraIcon = Object.assign(document.createElement('i'), {
    id: 'offer-interview',
  });
  const type = localStorage.getItem('type');
  if (event) {
    const messageCard = document.getElementById(
      `${event.target.parentElement.parentElement.id}`,
    );
    const exclamationIcon = messageCard.children[2];
    exclamationIcon.style.opacity = 0;
  }

  reciId = recipientId;
  await readMsg(getRoomId);
  const userName = document.createElement('h6');
  userName.innerText = `${name} 님`;

  const iconBox = document.createElement('div');
  iconBox.className = `chat-icon-box`;

  // icon변수에 i태그의 요소와  id를 추가
  const closeIcon = Object.assign(document.createElement('i'), {
    id: 'close-chatting',
  });
  // closeIcon에 className을 추가
  closeIcon.className = 'fa-solid fa-xmark close-message';
  closeIcon.onclick = leaveRoom;

  iconBox.append(closeIcon);
  if (type === 'company') {
    iconBox.prepend(cameraIcon);
    cameraIcon.className = 'fa-solid fa-video offer-interview';
    // cameraIcon.onclick = startInterview(getRoomId, recipientId);
    iconBox.style.justifyContent = 'space-between';
  } else {
    iconBox.style.justifyContent = 'end';
  }
  chatBoxTitle.prepend(userName);
  chatBoxTitle.append(iconBox);
  await getChatContents(getRoomId);

  // 소켓룸 조인하기
  socket.emit('join', getRoomId);

  roomId = getRoomId;
  chatContainer.style.display = 'flex';
  chattingContainer.scrollTop = chattingContainer.scrollHeight;
  cameraIcon.onclick = function () {
    startInterview(roomId, reciId);
  };
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
  if (newMsgs.length && alarmIcon) alarmIcon.style.opacity = 1;
  newMsgIcon(newMsgs);
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
  const myId = window.localStorage.getItem('id');
  const myType = window.localStorage.getItem('type');
  const payload = {
    userId: myId,
    userType: myType,
    roomId,
  };
  // 메세지 내용 저장하기
  await socket.emit('message', chatContent.value, payload);

  // 소켓 상대방에게 메세지알림 보내기
  socket.emit('msg-notification', reciId, myId);
  chatContent.value = '';
}

// 마이채용공고리스트
if (myApplyList) {
  myApplyList.addEventListener('click', () => {
    const type = window.localStorage.getItem('type');
    location.href = `/apply/${type}`;
  });
}
