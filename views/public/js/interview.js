// 해당 유저의 디바이스에 접근
let myStream;
let myPeerConnetion;
let muted = false;
let cameraOff = false;

const videoSelect = document.getElementById('video-select');
const closeInterviewBtn = document.getElementById('close-interview');
const interview = document.getElementById('interview-container');
const myVideo = document.getElementById('my-video');
const peerVideo = document.getElementById('peer-video');
const muteBtn = document.getElementById('mute-on-off');
const cameraOnOff = document.getElementById('camera-on-off');

// 1. 면접아이콘클릭시 실행 함수
// 상대방의 id도 같이 보내서 redis에 저장된 socket id로 offer를 보낸다.
async function startInterView(roomId, reciId) {
  // 상대에게 인터뷰 신청을 알림
  const payload = {
    roomId,
    reciId,
  };
  await getMedia(); // 유저의 카메라 가져오기
  makeConnection(payload);
  // makeConnection(roomId);
  hideScroll(); // 4. html 스크롤 없애기
  // socket.emit('interview-call', payload);
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

async function handleCameraChange() {
  await getMedia(videoSelect.value);
  if (myPeerConnetion) {
    const videoTrack = myStream.getVideoTracks()[0];
    console.log(myPeerConnetion.getSenders());
    const videoSender = myPeerConnetion
      .getSenders()
      .find((sender) => sender.track.kind === 'video');
    videoSender.replaceTrack(videoTrack);
  }
}

function handleMute() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = 'Mute off';
    muted = true;
  } else {
    muteBtn.innerText = 'Mute on';
    muted = false;
  }
}
function handleCamera() {
  // console.log(myStream.get);
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!cameraOff) {
    cameraOnOff.innerText = 'Camera off';
    cameraOff = true;
  } else {
    cameraOnOff.innerText = 'Camera on';
    cameraOff = false;
  }
}

// 상대가 화상면접 신청을 받음
async function receivedInterview(param) {
  // 소켓으로 join하기
  await getMedia(); // 유저의 카메라 가져오기
  makeConnection(param.roomId);
  await socket.emit('interview-join', param.roomId);
  hideScroll();
}

// 상대가 화상면접신청에 응하면
async function createOffer(roomId) {
  // 상대방에게 보낼 초대장(offer)을 만든다.
  const offer = await myPeerConnetion.createOffer();
  myPeerConnetion.setLocalDescription(offer);
  const payload = {
    roomId,
    offer,
  };
  socket.emit('send-offer', payload);
}
let roomNum;

// RTC code
function makeConnection(payload) {
  roomNum = payload['roomId'];
  // 각 브라우저에서 peer to peer연결
  myPeerConnetion = new RTCPeerConnection();
  // myPeerConnection을 만든 후 icecadidate를 linsten한다.
  myPeerConnetion.addEventListener('icecandidate', handleIce);
  myPeerConnetion.addEventListener('track', handleAddStream);
  // 카메라와 마이크의 데이터 Stream을 받아 myPeerConnection에 넣는다.
  myStream
    .getTracks()
    .forEach((track) => myPeerConnetion.addTrack(track, myStream));
}

async function handleIce(data) {
  const payload = {
    roomId: roomNum,
    icecandidate: data,
  };

  await socket.emit('send-ice', payload);
}

async function handleAddStream(data) {
  peerVideo.srcObject = data.streams[0];
  // peerVideo.play();
}

// 상대에게서 받은 offer를 setRemoteDescription로 세팅한다.
async function setRemoteOffer(params) {
  // 상대에게 받은 offer니까 remote로 저장
  myPeerConnetion.setRemoteDescription(params.offer);
  // offer에 응해서 answer를 만들어 준다.
  const answer = await myPeerConnetion.createAnswer();
  // answer는 자기가 만들었으므로 setLocalDescription을 해준다.
  myPeerConnetion.setLocalDescription(answer);
  const payload = {
    roomId: params.roomId,
    answer,
  };
  socket.emit('send-answer', payload);
}

async function setRemoteAnswer(params) {
  // 화상면접 신청을 받은 상대가 보낸 answer를 setRemote에 저장
  myPeerConnetion.setRemoteDescription(params.answer);
}

muteBtn.addEventListener('click', handleMute);
cameraOnOff.addEventListener('click', handleCamera);
videoSelect.addEventListener('input', handleCameraChange);

// socket
socket.on('inteview-received', (param) => {
  receivedInterview(param);
});

socket.on('welcome', createOffer);

// 상대에게서 받은 offer받기
socket.on('offer-received', setRemoteOffer);

// 화상면접신청을 받은 사람이 보낸 answer받기
// socket.on('answer-received', (answer, socketId) => {
//   const peerConnection = myPeerConnetion(socketId);
// });
socket.on('answer-received', setRemoteAnswer);

socket.on('ice-received', (ice) => {
  myPeerConnetion.addIceCandidate(ice);
});

// 인터뷰창 닫기
closeInterviewBtn.addEventListener('click', closeInterview);

function closeInterview() {
  interview.style.display = 'none';
  document.body.style.overflow = 'scroll';
}

// 면접화면 및 메인화면 스크롤 없애기
function hideScroll() {
  interview.style.display = 'block';
  document.body.style.overflow = 'hidden';
}
