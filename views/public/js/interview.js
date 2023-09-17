// // 해당 유저의 디바이스에 접근
let myPeerConnection;
let setRoomId;
let myStream;
let companyId;
let muted = false;
let cameraOff = false;
const videoSelect = document.getElementById('video-select');
const closeInterviewBtn = document.getElementById('close-interview');
const interview = document.getElementById('interview-container');
const myVideo = document.getElementById('my-video');
const muteBtn = document.getElementById('mute-on-off');
const cameraOnOff = document.getElementById('camera-on-off');

// 1. 회사가 면접 신청
const startInterview = (roomId, reciId) => {
  try {
    closeInterviewBtn.setAttribute('data-set', reciId);
    setRoomId = roomId;
    // 먼저 상대방이 로그인을 했는지 않했는지 확인한다.
    socket.emit('interview-call', roomId, reciId);
  } catch (error) {
    console.log(error);
  }
};

socket.on('interview-received', async (param) => {
  if (param.status === false) {
    alert(param.errorMsg);
  } else {
    // 2. 회사유저가 면접화면에 먼저 입장
    await interViewScreen(param);
    createConnection();
    const id = localStorage.getItem('id');
    param['companyId'] = id;
    // 상대방에게 면접신청 알림보내기
    socket.emit('apply-interview', param);
  }
});

// 화상면접신청을 받은 유저는 알림을 받는다.

socket.on('apply-interview', notificationInterview);
function notificationInterview(params) {
  setRoomId = params['roomId'];
  companyId = params['companyId'];
  const notifiInterview = document.getElementById('notification-interview');
  const notificationTitle = document.getElementById('notification-title');
  notificationTitle.innerText = '';
  notificationTitle.innerText = `${params['title']}님으로 부터 화상면접신청이 들어왔습니다.`;
  notifiInterview.style.display = 'block';
}

// 화상면접 신청을 거절하는 버튼
const refuseBtn = document.getElementById('refuse-interview');
refuseBtn.addEventListener('click', refuseInterview);
async function refuseInterview() {
  const notifiInterview = document.getElementById('notification-interview');
  await socket.emit('refuse-interview', companyId);
  notifiInterview.style.display = 'none';
  companyId = '';
}

// 인터뷰화면 닫기
closeInterviewBtn.addEventListener('click', closeInterView);

// 상대가 면접 신청을 거절할 경우 화상채팅방끄고 peerConnection초기화 socket leave하기
socket.on('refuse-interview', () => {
  alert('상대방이 거절했습니다.');
  closeInterView();
});

// 화면을 갑자기 꺼버리면
function closeInterView() {
  const peerVideo = document.getElementById('peer-video');
  const userId = closeInterviewBtn.getAttribute('data-set');
  socket.emit('close-notification-interview', userId);
  interview.style.display = 'none';
  document.body.style.overflow = 'scroll';
  const tracks = myStream.getTracks();
  if (tracks) {
    tracks.forEach((track) => {
      track.stop();
    });
  }
  peerVideo.srcObject = null;
  myVideo.srcObject = null;
  myPeerConnection = '';
  videoSelect.options.length = 0;
  socket.emit('leave', setRoomId);
}

// 화상면접을 신청한 사람이 갑자기 취소하면
socket.on('close-notification-interview', async () => {
  const notifiInterview = document.getElementById('notification-interview');
  if (notifiInterview.style.display === 'block') {
    alert('상대방과 연결이 끊겼습니다.');
    notifiInterview.style.display = 'none';
  }
});

// 화상면접 신청을 수락하는 버튼
const acceptBtn = document.getElementById('accept-interview');
acceptBtn.addEventListener('click', acceptInterview);

// 화상면접에 응하면
async function acceptInterview() {
  const notifiInterview = document.getElementById('notification-interview');
  notifiInterview.style.display = 'none';
  await interViewScreen();
  createConnection();
  // 받은 roomId로 join
  socket.emit('interview-join', setRoomId);
}

// 면접을 신청받은 유저가 join을 했을 시
socket.on('welcome', async (roomName) => {
  // 면접을 신청한 유저는 offer를 만든다.
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  const payload = {
    offer,
    roomId: roomName,
  };
  socket.emit('send-offer', payload);
});

// 면접을 신청한 유저가 보낸 offer를 신청 받은 유저가 받는다.
socket.on('offer-received', async (params) => {
  await myPeerConnection.setRemoteDescription(params['offer']);
  // offer를 setRemoteDescription하면 answer를 만들어 신청한 유저에게 보낸다.
  const answer = await myPeerConnection.createAnswer();
  const payload = {
    roomId: params['roomId'],
    answer: answer,
  };
  // answer가 만들어 지면 우선 localDescription을 한다.
  myPeerConnection.setLocalDescription(answer);

  socket.emit('send-answer', payload);
});

// 면접을 신청한 유저는 answer를 받는다.
socket.on('answer-received', async (params) => {
  // 면접을 신청한 유저는 받은 answer를 remoteDescription을 한다.
  await myPeerConnection.setRemoteDescription(params['answer']);
});

async function interViewScreen() {
  interview.style.display = 'block';
  document.body.style.overflow = 'hidden';
  await getMedia();
}

// 2. 유저가 가지고 있는 미디어 장치 가지고 오기
async function getMedia(deviceId) {
  // 디바이스가 없을 때 실행
  const initialConstrains = {
    audio: true,
    video: { facingMode: 'user' },
  };
  //
  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstrains,
    );
    console.log(deviceId);
    if (!deviceId) {
      // 4. 카메라 정보가져오기
      await getCamera();
    }
    myVideo.srcObject = myStream;
    myVideo.play();
  } catch (error) {
    console.log(error);
  }
}

// mediaDevices.enumerateDevices안에 있는 유저의 컴퓨터에 연결된 모든 미디어 장치들 불러오기
async function getCamera() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    // 많은 디바이스 중에 videoinput(카메라디바이스)만 가지고 오기
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    const crrCamera = myStream.getVideoTracks()[0];
    //  카메라select박스에 넣기
    cameras.forEach((camera) => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (crrCamera.label == camera.label) {
        option.selected = true;
      }
      videoSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

// 뮤트 on off
function handleMuteClick() {
  console.log('뮤트');
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = 'Mute on';
    muted = true;
  } else {
    muteBtn.innerText = 'Mute off';
    muted = false;
  }
}

// 카메라 바꾸기
function handleCameraClick() {
  // getVideoTracks의 enabled에 true false값을 넣어준다.
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraOnOff.innerText = 'Camera off';
    cameraOff = false;
  } else {
    cameraOnOff.innerText = 'Camera on';
    cameraOff = true;
  }
}
// 카메라 변경하기
async function handleCameraChange() {
  await getMedia(videoSelect.value);
}

socket.on('ice-received', async (param) => {
  myPeerConnection.addIceCandidate(param[0]);
});

async function createConnection() {
  myPeerConnection = new RTCPeerConnection();
  myPeerConnection.addEventListener('icecandidate', handleIce);
  myPeerConnection.addEventListener('track', handleAddStream);
  myStream.getTracks().forEach((track) => {
    myPeerConnection.addTrack(track, myStream);
  }); // 영상과 음성 트랙을 myPeerConnection에 추가해줌 -> Peer-to-Peer 연결!!
}

// icecandidate를 만들어서 보낸다.
function handleIce(data) {
  socket.emit('send-ice', data.candidate, setRoomId);
}

function handleAddStream(data) {
  const peerVideo = document.getElementById('peer-video');
  peerVideo.srcObject = data.streams[0];
}

muteBtn.addEventListener('click', handleMuteClick);
cameraOnOff.addEventListener('click', handleCameraClick);
videoSelect.addEventListener('input', handleCameraChange);
