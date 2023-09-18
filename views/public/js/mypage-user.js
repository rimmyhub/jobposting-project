// 페이지 로드시 실행 함수
document.addEventListener('DOMContentLoaded', async (e) => {
  e.preventDefault();
  await init();
  init2();
  getUserImage();
});

// init
async function init() {
  // 유저 데이터
  await getUserData();
  // 유저 이력서
  await getUserResume();
  // 유저 학력
  await getUserEducation();
  // 유저 경력
  await getUserCareer();
  // 유저 포트폴리오
  await getUserPortfolio();
  // 유저 자기소개서
  await getUserAboutMe();
}
// 유저의 이력서ID 값만 가져오는 함수
async function getResumeId() {
  const userId = await getUserData();

  const resumeId = await fetch(`/api/resumes/user/${userId}`);
  const res = await resumeId.json();

  if (res.message) {
    console.log(res.message);
  }

  return res;
}
// 유저 정보를 불러오는 함수 로직
async function getUserData() {
  const userInfoBox = document.querySelector('#userInfoBox');

  const userImage = document.querySelector('.profile-box');
  // 메인로직
  const userData = await fetch(`/api/users/user-page`);
  // 데이터 가공
  const jsonUserData = await userData.json();
  // 프사
  userImage.innerHTML = `<div class="profile-box">
                          <img
                            src="${jsonUserData.image}"
                            id="image"
                            class="user-img"
                            alt="/img/userImg.jpg"
                            srcset=""
                          />
                          <i class="fa-solid fa-pen edit-icon" style="color: #0d6efd">수정</i>
                          <input
                            id="user-image"
                            class="img-file"
                            type="file"
                            accept="image/jpeg, image/png"
                            onerror="console.log(error)"
                          />
                        </div>
                        `;
  // 유저정보
  userInfoBox.innerHTML = `<div class="col-sm-8" id="userInfoBox" data-id="${jsonUserData.id}">
    <!-- 이름 -->
    <div class="row">
      <div class="col-sm-4">
        <p class="text-start text-body-secondary">이름</p>
      </div>
      <div class="col-sm-8">
        <p class="text-start">${jsonUserData.name}</p>
      </div>
    </div>
    <!-- 이름 -->

    <!-- 이메일 -->
    <div class="row">
      <div class="col-sm-4">
        <p class="text-start text-body-secondary">이메일</p>
      </div>
      <div class="col-sm-8">
        <p class="text-start">${jsonUserData.email}</p>
      </div>
    </div>
    <!-- 이메일 -->

    <!-- 전화번호 -->
    <div class="row">
      <div class="col-sm-4">
        <p class="text-start text-body-secondary">전화번호</p>
      </div>
      <div class="col-sm-8">
        <p class="text-start">${jsonUserData.phone}</p>
      </div>
    </div>
    <!-- 전화번호 -->

    <!-- 성별 -->
    <div class="row">
      <div class="col-sm-4">
        <p class="text-start text-body-secondary">성별</p>
      </div>
      <div class="col-sm-8">
        <p class="text-start">${jsonUserData.gender}</p>
      </div>
    </div>
    <!-- 성별 -->

    <!-- 주소 -->
    <div class="row">
      <div class="col-sm-4">
        <p class="text-start text-body-secondary">주소</p>
      </div>
      <div class="col-sm-8">
        <p class="text-start">${jsonUserData.address}</p>
      </div>
    </div>
    <!-- 주소 -->

    <!-- 생년월일 -->
    <div class="row">
      <div class="col-sm-4">
        <p class="text-start text-body-secondary">생년월일</p>
      </div>
      <div class="col-sm-8">
        <p class="text-start">${jsonUserData.birth}</p>
      </div>
    </div>
    <!-- 생년월일 -->
  </div>`;

  return jsonUserData.id;
}
// 유저의 이미지를 불러오는 함수
async function getUserImage() {
  const userImage = document.getElementById('image');
  const imageUploadEl = document.getElementById('user-image');
  const imageDeleteEl = document.getElementById('image-delete');
  const saveBtnEl = document.getElementById('save-btn');
  let imageUrl = userImage.src; // 기존 이미지 URL 가져오기

  // 기본 프로필 적용하기
  imageDeleteEl.addEventListener('click', () => {
    imageUrl = '/img/userImg.jpg'; // 이미지 삭제 시 URL 업데이트
    userImage.src = imageUrl; // 이미지 보여주기
  });

  // 이미지 변경하기
  imageUploadEl.addEventListener('change', async (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    // 파일 유효성 검사
    if (selectedFile) {
      if (selectedFile.size > 1 * 1024 * 1024) {
        alert('파일 용량은 최대 1MB입니다.');
        return;
      }

      if (
        !selectedFile.type.includes('jpeg') &&
        !selectedFile.type.includes('png')
      ) {
        alert('jpeg 또는 png 파일만 업로드 가능합니다!');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          imageUrl = data.url; // 업로드된 이미지 URL 업데이트
          userImage.src = imageUrl; // 이미지 보여주기

          console.log(data);
        } else {
          throw new Error('이미지 업로드에 실패했습니다.');
        }
      } catch (error) {
        console.error(error);
        alert('이미지 업로드에 실패했습니다.');
      }
    }
  });

  // 이미지 저장
  saveBtnEl.addEventListener('click', async () => {
    if (imageUrl) {
      try {
        await saveUserImage(imageUrl);
        alert('이미지가 저장되었습니다.');
        window.location.reload();
      } catch (error) {
        console.error('이미지 저장 오류:', error);
        alert('이미지 저장에 실패했습니다.');
      }
    } else {
      alert('이미지를 먼저 업로드하세요.');
    }
  });

  // api 호출
  async function saveUserImage(imageUrl) {
    try {
      const response = await fetch('/api/users/image', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageUrl }),
      });

      if (!response.ok) {
        throw new Error('이미지 저장 실패');
      }
    } catch (error) {
      console.error('이미지 저장 오류:', error);
      throw error;
    }
  }
}
// 유저의 이력서를 불러오는 함수 로직
async function getUserResume() {
  const resumeBox = document.querySelector('#resumeBox');
  // 이력서ID 가져오기
  const resumeId = await getResumeId();
  if (resumeId.message === '이력서를 작성해주세요.') {
    return;
  }
  // 만들어둔 이력서 조회 API fetch 요청 보냄
  const userResumeData = await fetch(`/api/resumes/${resumeId}`);
  // 받아온 데이터 할당
  const jsonUserResumeData = await userResumeData.json();
  // 예외 처리
  if (jsonUserResumeData.message) {
    return console.log(jsonUserResumeData.message);
  }
  resumeBox.innerHTML = '';
  // 메인 로직
  resumeBox.innerHTML = `<div class="col-sm-8" id="resumeBox" data-resumeId="${jsonUserResumeData.id}">
                        <p
                            class="fs-2 fw-semibold text-start information"
                            style="margin: 10px"
                        >
                            ${jsonUserResumeData.title}
                        </p>
                        <p class="text-start">
                            ${jsonUserResumeData.content}
                        </p>
                        <!-- 구분선 -->
                        <hr />
                        </div>`;
  return jsonUserResumeData.id;
}
// 유저의 학력을 불러오는 함수 로직
async function getUserEducation() {
  const educationBox = document.querySelector('#educationBox');
  // 유저 이력서 아이디
  const resumeId = await getUserResume();
  if (!resumeId) {
    return;
  }
  // 서버에게 데이터 요청
  const userEducationData = await fetch(`/api/educations/${resumeId}`);
  // 데이터 가공
  const jsonUserEducationData = await userEducationData.json();
  // 예외처리
  if (jsonUserEducationData.message) {
    return console.log(jsonUserEducationData.message);
  }
  // 예외처리에 걸러지지 않았다면 메인로직 실행
  educationBox.innerHTML = '';

  jsonUserEducationData.forEach((educationInfo) => {
    educationBox.innerHTML += `<div class="col-sm-8" id="educationBox" data-id="${educationInfo.id}">
                                <p
                                  class="fs-2 fw-semibold text-start information"
                                  style="margin: 10px"
                                >
                                  ${educationInfo.schoolTitle}
                                </p>

                                <!-- 구분선 -->
                                <hr />

                                <!-- 전공 -->
                                <div class="row">
                                  <div class="col-sm-4">
                                    <p class="text-start text-body-secondary">전공</p>
                                  </div>
                                  <div class="col-sm-8">
                                    <p class="text-start">${educationInfo.major}</p>
                                  </div>
                                </div>
                                <!-- 전공 -->

                                <!-- 입학년도 -->
                                <div class="row">
                                  <div class="col-sm-4">
                                    <p class="text-start text-body-secondary">입학년도</p>
                                  </div>
                                  <div class="col-sm-8">
                                    <p class="text-start">${educationInfo.admissionYear}</p>
                                  </div>
                                </div>
                                <!-- 입학년도 -->

                                <!-- 졸업년도 -->
                                <div class="row">
                                  <div class="col-sm-4">
                                    <p class="text-start text-body-secondary">졸업년도</p>
                                  </div>
                                  <div class="col-sm-8">
                                    <p class="text-start">${educationInfo.graduationYear}</p>
                                  </div>
                                </div>
                                <!-- 졸업년도 -->
                                <button
                                type="button"
                                id="${educationInfo.id}"
                                class="btn btn-primary fa-solid fa-pen"
                                data-bs-toggle="modal"
                                data-bs-target="#education"
                                OnClick="educationEditbtn(${educationInfo.id})"
                                >
                                  수정
                                </button>
                              </div>`;
  });
}
// 유저의 경력을 불러오는 함수 로직
async function getUserCareer() {
  const careerBox = document.querySelector('#careerBox');
  // 유저 이력서 아이디
  const resumeId = await getUserResume();
  if (!resumeId) {
    return;
  }
  // 서버요청
  const userCareerData = await fetch(`/api/careers/${resumeId}`);
  // 데이터가공
  const jsonUserCareerData = await userCareerData.json();
  // 예외처리
  if (jsonUserCareerData.message) {
    return console.log(jsonUserCareerData.message);
  }
  // 메인로직 실행
  careerBox.innerHTML = '';

  jsonUserCareerData.forEach((careerInfo) => {
    careerBox.innerHTML += `<div class="col-sm-8" id="careerBox">
    <p
      class="fs-2 fw-semibold text-start information"
      style="margin: 10px"
    >
      ${careerInfo.companyTitle}
    </p>

    <!-- 구분선 -->
    <hr />

    <!-- 직책 -->
    <div class="row">
      <div class="col-sm-4">
        <p class="text-start text-body-secondary">직책</p>
      </div>
      <div class="col-sm-8">
        <p class="text-start">${careerInfo.position}</p>
      </div>
    </div>
    <!-- 직책 -->

    <!-- 직무 -->
    <div class="row">
      <div class="col-sm-4">
        <p class="text-start text-body-secondary">직무</p>
      </div>
      <div class="col-sm-8">
        <p class="text-start">${careerInfo.job}</p>
      </div>
    </div>
    <!-- 직무 -->

    <!-- 입사날짜 -->
    <div class="row">
      <div class="col-sm-4">
        <p class="text-start text-body-secondary">입사날짜</p>
      </div>
      <div class="col-sm-8">
        <p class="text-start">${careerInfo.joiningDate}</p>
      </div>
    </div>
    <!-- 입사날짜 -->

    <!-- 퇴사날짜 -->
    <div class="row">
      <div class="col-sm-4">
        <p class="text-start text-body-secondary">퇴사날짜</p>
      </div>
      <div class="col-sm-8">
        <p class="text-start">${careerInfo.resignationDate}</p>
      </div>
    </div>
    <!-- 퇴사날짜 -->
    <button
            type="button"
            class="btn btn-primary fa-solid fa-pen"
            data-bs-toggle="modal"
            data-bs-target="#career"
            onclick="sendCareerId(${careerInfo.id})"
          >
            수정
          </button>
  </div>
  `;
  });
}
// 유저의 포트폴리오를 불러오는 함수 로직
async function getUserPortfolio() {
  const portfolioBox = document.querySelector('#portfolioBox');
  // 유저 이력서 아이디
  const resumeId = await getUserResume();
  if (!resumeId) {
    return;
  }
  // 서버요청
  const userPortfolio = await fetch(`/api/portfolio/${resumeId}`);
  // 가공
  const jsonUserPortfolio = await userPortfolio.json();
  // 예외처리
  if (jsonUserPortfolio.message) {
    return console.log(jsonUserPortfolio.message);
  }
  // 메인로직 시작
  portfolioBox.innerHTML = '';

  jsonUserPortfolio.forEach((portfolioInfo) => {
    portfolioBox.innerHTML += `<div class="col-sm-8" id="portfolioBox">
    <!-- 파일 -->
    <div class="row">
      <div class="col-sm-4">
        <p class="text-start text-body-secondary">파일</p>
      </div>
      <div class="col-sm-8">
        <p class="text-start">${portfolioInfo.file}</p>
      </div>
    </div>
    <!-- 파일 -->

    <!-- URL -->
    <div class="row">
      <div class="col-sm-4">
        <p class="text-start text-body-secondary">URL</p>
      </div>
      <div class="col-sm-8">
        <p class="text-start">${portfolioInfo.address}</p>
      </div>
    </div>
    <button
            type="button"
            class="btn btn-primary fa-solid fa-pen"
            data-bs-toggle="modal"
            data-bs-target="#portfolio"
            onclick="sendPortfolioId(${portfolioInfo.id})"
          >
            수정
          </button>
  </div>
  `;
  });
}
// 유저의 자기소개서를 불러오는 함수 로직
async function getUserAboutMe() {
  const aboutMeBox = document.querySelector('#aboutMeBox');
  // 유저 이력서 아이디
  const resumeId = await getUserResume();
  if (!resumeId) {
    return;
  }
  // 서버 요청
  const userAboutMe = await fetch(`/api/aboutmes/${resumeId}`);
  // 데이터 가공
  const jsonUserAboutMe = await userAboutMe.json();
  // 예외처리
  if (jsonUserAboutMe.message) {
    return console.log(jsonUserAboutMe.message);
  }
  // 메인로직 실행
  aboutMeBox.innerHTML = '';
  await jsonUserAboutMe.forEach((aboutMeInfo) => {
    aboutMeBox.innerHTML += `<div class="col-sm-8" id="aboutMeBoxes" data-aboutMeId="${aboutMeInfo.id}">
                                <p
                                  class="fs-2 fw-semibold text-start information"
                                  style="margin: 10px"
                                >
                                  ${aboutMeInfo.title}
                                </p>
                                <hr />
                                <p class="text-start">
                                  ${aboutMeInfo.content}
                                </p>
                                <!-- 수정 아이콘 -->
                                <button
                                type="button"
                                class="btn btn-primary fa-solid fa-pen"
                                data-bs-toggle="modal"
                                data-bs-target="#aboutme"
                                id="aboutMeChangeBtn"
                                onclick="sendAboutMeId(${aboutMeInfo.id})"
                              >
                                수정
                              </button>
                            </div>`;
  });
}

// init2
async function init2() {
  // 유저 관련
  userUpdate();
  // 이력서 관련
  createResume();
  resumeUpdate();
  resumeDelete();
  // 학력 관련
  educationAdd();
  educationUpdate();
  educationDelete();
  // 경력 관련
  careerAdd();
  careerUpdate();
  careerDelete();
  // 포트폴리오 관련
  portfolioAdd();
  portfolioUpdate();
  portfolioDelete();
  // 자기소개서 관련
  aboutMeAdd();
  aboutMeUpdate();
  aboutMeDelete();
}
// 개인정보 "수정" 버튼 클릭 후 "저장" 버튼 클릭 시 "수정" 로직 실행 함수
function userUpdate() {
  const userUpdateBtn = document.querySelector('#userUpdateBtn');
  userUpdateBtn.addEventListener('click', async () => {
    // body 값
    const name = document.querySelector('#userNameTag').value;
    const email = document.querySelector('#userEmailTag').value;
    const phone = document.querySelector('#userPhoneTag').value;
    const gender = document.querySelector('#userGenderTag').value;
    const address = document.querySelector('#userAddressTag').value;
    const birth = document.querySelector('#userBirthTag').value;
    // 서버로 요청
    const userUpdateData = await fetch(`/api/users`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, gender, address, birth }),
    });
    // 데이터 가공
    const jsonUserUpdateData = await userUpdateData.json();
    if (jsonUserUpdateData.message) {
      return alert(jsonUserUpdateData.message);
    }
    alert(`유저 정보가 수정되었습니다.`);
    window.location.reload();
  });
}

// 이력서 "생성" 버튼 클릭 후 "저장" 누를 시 이력서 "생성" 로직 실행 함수
function createResume() {
  const createResumeBtn = document.querySelector('#createResumeBtn');
  // 이벤트 리스너 설치
  createResumeBtn.addEventListener('click', async (e) => {
    // 바디값
    const title = document.querySelector('#createTitle').value;
    const content = document.querySelector('#createContent').value;

    const req = await fetch(`/api/resumes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    const res = await req.json();
    console.log(res);
    if (res.message) {
      console.log(res.message);
    }
    alert(`"${res.id}" 이력서가 생성되었습니다.`);
    window.location.reload();
  });
}

// 이력서 "수정" 버튼 클릭 후 "저장" 누를 시 이력서 "수정" 로직 실행 함수
function resumeUpdate() {
  const updateBtn = document.querySelector('#updateResumeBtn');
  updateBtn.addEventListener('click', async (e) => {
    // body value
    const title = document.querySelector('#title').value;
    const content = document.querySelector('#content').value;
    // 유저 이력서 아이디
    const resumeId = await getUserResume();
    // 서버요청
    const updateResumeData = await fetch(`/api/resumes/${resumeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    // 데이터 가공
    const jsonUpdateResumeData = await updateResumeData.json();
    // 사용자에게 알림
    jsonUpdateResumeData.message
      ? alert(`수정할 이력서의 제목과 내용을 입력해 주세요.`)
      : alert(`${jsonUpdateResumeData.title} 로 이력서를 수정하였습니다.`);
    // 로직 종료 후 창 새로고침
    window.location.reload();
  });
}

// 이력서 "수정" 버튼 클릭 후 "삭제" 누를 시 이력서 "삭제" 로직 실행 함수
function resumeDelete() {
  const deleteResumeBtn = document.querySelector('#deleteResumeBtn');
  deleteResumeBtn.addEventListener('click', async (e) => {
    // 유저 이력서 아이디
    const resumeId = await getUserResume();
    // 서버요청
    const removeData = await fetch(`/api/resumes/${resumeId}`, {
      method: 'DELETE',
    });
    // 데이터 가공
    const jsonRemoveData = await removeData.json();
    // 예외처리
    if (jsonRemoveData.message) {
      return alert(jsonRemoveData.message);
    }
    // 반환값
    alert(`"${jsonRemoveData.title}" 이력서가 삭제되었습니다.`);
    window.location.reload();
  });
}

// 학력정보 불러오기
const dropdownItems = document.querySelectorAll('.item');
const selectedValueElement = document.getElementById('selectedValue');

const selectedValueElement2 = document.getElementById('selectedValue2');
let aEducation = '추가';
let bEducation = '수정';
dropdownItems.forEach((item) => {
  item.addEventListener('click', () => {
    selectedValueElement.textContent = item.textContent;
    selectedValueElement2.textContent = item.textContent;
    aEducation = selectedValueElement.textContent;
    bEducation = selectedValueElement2.textContent;
  });
});

// 학력아이디
let educationId;
function educationEditbtn(id) {
  educationId = id;
}

// 학력 "추가" 로직 실행 함수
async function educationAdd() {
  // 이벤트 리스너 등록
  const addEducationBtn = document.querySelector('#addEducationBtn');
  const saveEducationBtn = document.querySelector('#saveEducationBtn');
  // 유저 이력서 아이디
  const resumeId = await getResumeId();
  if (resumeId.message === '이력서를 작성해주세요.') {
    return;
  }
  // 추가 버튼 이벤트 리스너
  addEducationBtn.addEventListener('click', async () => {
    // 다시 한번 resumeId를 확인하고, 이력서 ID가 없는 경우 얼럿을 띄움
    const updatedResumeId = await getUserResume();
    if (!updatedResumeId) {
      alert('먼저 이력서를 작성해주세요.');
      return; // 함수 실행 중단
    }
  });
  // 저장 버튼 이벤트 리스너
  saveEducationBtn.addEventListener('click', async () => {
    // 이력서 ID가 있는 경우 아래 로직을 실행
    const schoolTitle = document.querySelector('#schoolNameTag').value;
    const major = document.querySelector('#majorTag').value;
    const admissionYear = document.querySelector('#admissionYearTag').value;
    const graduationYear = document.querySelector('#graduationYearTag').value;
    const education = aEducation;

    // 데이터 보내기
    const addEducationData = await fetch(`/api/educations/${resumeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schoolTitle,
        major,
        admissionYear,
        graduationYear,
        education,
      }),
    });

    // 받아온 데이터 가공
    const jsonAddEducationData = await addEducationData.json();

    // 예외처리
    if (jsonAddEducationData.message) {
      alert(jsonAddEducationData.message);
      return;
    }

    // 사용자에게 응답값 전달
    alert(`${jsonAddEducationData.education} 학력이 추가되었습니다.`);
    window.location.reload();
  });
}

// 학력 "수정" 버튼 클릭 후 "저장" 버튼 클릭 시 학력 "수정" 로직 실행 함수
function educationUpdate() {
  const educationUpdateBtn = document.querySelector('#educationUpdateBtn');
  educationUpdateBtn.addEventListener('click', async (e) => {
    // 바디값
    const schoolTitle = document.querySelector('#schoolTitleUpdateTag').value;
    const major = document.querySelector('#majorUpdateTag').value;
    const admissionYear = document.querySelector(
      '#admissionYearUpdateTag',
    ).value;
    const graduationYear = document.querySelector(
      '#graduationYearUpdateTag',
    ).value;
    const education = bEducation;
    // 학력 아이디
    const id = educationId;
    // 서버요청
    const educationUpdateData = await fetch(`/api/educations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schoolTitle,
        major,
        admissionYear,
        graduationYear,
        education,
      }),
    });
    // 가져온 데이터 가공
    const jsonEducationUpdateData = await educationUpdateData.json();
    // 예외처리
    if (jsonEducationUpdateData.message) {
      alert(jsonEducationUpdateData.message);
      return;
    }
    // 사용자 표시
    alert(
      `${jsonEducationUpdateData.education} 학력이 정상적으로 수정 되었습니다.`,
    );
    window.location.reload();
  });
}

// 학력 "수정" 버튼 클릭 후 "삭제" 버튼 클릭 시 학력 "삭제" 로직 실행 함수
function educationDelete() {
  const educationDeleteBtn = document.querySelector('#educationDeleteBtn');
  educationDeleteBtn.addEventListener('click', async (e) => {
    //
    const id = educationId;
    // 메인로직
    const deleteEducationData = await fetch(`/api/educations/${id}`, {
      method: 'delete',
    });
    const jsonDeleteEducationData = await deleteEducationData.json();
    // 사용자에 표시
    alert(jsonDeleteEducationData.message);
    // 새로고침
    window.location.reload();
  });
}

// 경력 아이디 받아오기
let getCareerId;
function sendCareerId(id) {
  console.log(id);
  getCareerId = id;
}

// 경력 "추가" 로직 실행 함수
async function careerAdd() {
  // 이벤트 리스너 등록
  const addCareerBtn = document.querySelector('#addCareerBtn');
  const saveCareerBtn = document.querySelector('#saveCareerBtn');
  // 유저 이력서 아이디
  const resumeId = await getResumeId();
  if (resumeId.message === '이력서를 작성해주세요.') {
    return;
  }
  // 추가 버튼 이벤트 리스너
  addCareerBtn.addEventListener('click', async () => {
    // 다시 한번 resumeId를 확인하고, 이력서 ID가 없는 경우 얼럿을 띄움
    const updatedResumeId = await getUserResume();
    if (!updatedResumeId) {
      alert('먼저 이력서를 작성해주세요.');
      return; // 함수 실행 중단
    }
  });
  // 저장 버튼 이벤트 리스너
  saveCareerBtn.addEventListener('click', async () => {
    // 각 value값 가져오기
    const companyTitle = document.querySelector('#addCompanyTitle').value;
    const job = document.querySelector('#addJob').value;
    const joiningDate = document.querySelector('#addJoiningDate').value;
    const resignationDate = document.querySelector('#addResignationDate').value;
    const position = document.querySelector('#addPosition').value;

    // 메인로직
    const addCareerData = await fetch(`/api/careers/${resumeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyTitle,
        job,
        joiningDate,
        resignationDate,
        position,
      }),
    });
    const jsonAddCareerData = await addCareerData.json();
    // 예외처리
    if (jsonAddCareerData.message) {
      return alert(jsonAddCareerData.message);
    }
    // 반환값
    alert(
      `"${jsonAddCareerData.companyTitle}" 기업 경력이 이력서에 추가되었습니다.`,
    );
    // 새로고침
    window.location.reload();
  });
}

// 경력 "수정" 버튼의 "저장"버튼 클릭시 경력 "수정"로직 실행
function careerUpdate() {
  const updateCareerBtn = document.querySelector('#updateCareerBtn');
  updateCareerBtn.addEventListener('click', async () => {
    // 각 밸류값들
    const companyTitle = document.querySelector('#careerUpdateName').value;
    const position = document.querySelector('#careerUpdatePosition').value;
    const job = document.querySelector('#updateCareerJob').value;
    const joiningDate = document.querySelector(
      '#updateCareerJoiningDate',
    ).value;
    const resignationDate = document.querySelector(
      '#updateCareerResignationDate',
    ).value;
    // 경력아이디
    const careerId = getCareerId;
    // 메인로직
    const careerUpdateData = await fetch(`/api/careers/${careerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyTitle,
        position,
        job,
        joiningDate,
        resignationDate,
      }),
    });
    const jsonCareerUpdateData = await careerUpdateData.json();
    // 예외처리
    if (jsonCareerUpdateData.message) {
      return alert(jsonCareerUpdateData.message);
    }
    // 반환값
    alert(`${jsonCareerUpdateData.companyTitle} 기업 경력이 수정되었습니다.`);
    window.location.reload();
  });
}

// 경력 "수정" 버튼의 "삭제"버튼 클릭시 경력 "삭제"로직 실행
function careerDelete() {
  const deleteCareerBtn = document.querySelector('#deleteCareerBtn');
  deleteCareerBtn.addEventListener('click', async () => {
    // 경력 아이디
    const careerId = getCareerId;
    // 메인로직
    const careerDeleteData = await fetch(`/api/careers/${careerId}`, {
      method: 'DELETE',
    });
    // 데이터 가공
    const jsonCareerDeleteData = await careerDeleteData.json();
    console.log(jsonCareerDeleteData);
    alert(
      `"${jsonCareerDeleteData.companyTitle}" 기업 경력을 이력서에서 삭제하였습니다.`,
    );
    window.location.reload();
  });
}

// 포트폴리오 아이디
let getPortfolioId;
function sendPortfolioId(id) {
  console.log(id);
  getPortfolioId = id;
}

// 포트폴리오 "추가" 로직 실행 함수
async function portfolioAdd() {
  // 이벤트 리스너 등록
  const addPortfolioBtn = document.querySelector('#addPortfolioBtn');
  const savePortfolioBtn = document.querySelector('#savePortfolioBtn');
  // 유저 이력서 아이디
  const resumeId = await getResumeId();
  if (resumeId.message === '이력서를 작성해주세요.') {
    return;
  }
  // 추가 버튼 이벤트 리스너
  addPortfolioBtn.addEventListener('click', async () => {
    // 다시 한번 resumeId를 확인하고, 이력서 ID가 없는 경우 얼럿을 띄움
    const updatedResumeId = await getUserResume();
    if (!updatedResumeId) {
      alert('먼저 이력서를 작성해주세요.');
      return; // 함수 실행 중단
    }
  });
  // 저장 버튼 이벤트 리스너
  savePortfolioBtn.addEventListener('click', async () => {
    // 바디 밸류값 가져오기
    const address = document.querySelector('#addURLTag').value;
    const file = document.querySelector('#formFile').value;
    // 메인로직
    const portFolio = await fetch(`/api/portfolio/${resumeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, file }),
    });
    // 데이터 가공
    const jsonPortFolio = await portFolio.json();
    // 예외처리
    if (jsonPortFolio.message) {
      return alert(jsonPortFolio.message);
    }
    // 반환값
    alert(
      `현재 이력서에 ${jsonPortFolio.address} URL로 포트폴리오가 추가되었습니다.`,
    );
    window.location.reload();
  });
}

// 포트폴리오 "수정" 버튼 클릭 후 "저장"버튼 클릭시 포트폴리오 "수정"로직 실행
function portfolioUpdate() {
  const updatePortfolioBtn = document.querySelector('#updatePortfolioBtn');
  updatePortfolioBtn.addEventListener('click', async () => {
    // 필요 밸류값 가져오기
    const address = document.querySelector('#updateURL').value;
    const file = document.querySelector('#formFile-1').value;
    // URI 자원
    const resumeId = await getUserResume();
    const portfolioId = getPortfolioId;
    // 메인로직
    const updatePortfolio = await fetch(
      `/api/portfolio/${resumeId}/${portfolioId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          file,
        }),
      },
    );
    // 데이터 가공
    const jsonUpdatePortfolio = await updatePortfolio.json();
    // 예외처리
    if (jsonUpdatePortfolio.message) {
      return alert(jsonUpdatePortfolio.message);
    }
    // 반환값
    alert(`해당 ${jsonUpdatePortfolio.address} 포트폴리오가 수정되었습니다.`);
    window.location.reload();
  });
}

// 포트폴리오 "수정" 버튼 클릭 후 "삭제"버튼 클릭시 포트폴리오 "삭제"로직 실행
function portfolioDelete() {
  const deletePortfolioBtn = document.querySelector('#deletePortfolioBtn');
  deletePortfolioBtn.addEventListener('click', async () => {
    // URI 자원
    const resumeId = await getUserResume();
    const portfolioId = getPortfolioId;
    // 메인로직
    const deletePortfolioData = await fetch(
      `/api/portfolio/${resumeId}/${portfolioId}`,
      {
        method: 'DELETE',
      },
    );
    // 데이터 가공
    const jsonDeletePortfolioData = await deletePortfolioData.json();
    // 예외처리
    if (jsonDeletePortfolioData.message) {
      return alert(jsonDeletePortfolioData.message);
    }
    // 반환값
    alert(
      `${jsonDeletePortfolioData.address} URL의 포트폴리오가 삭제되었습니다.`,
    );
    // 새로고침
    window.location.reload();
  });
}

// 자소서 아이디
let getAboutMeId;
function sendAboutMeId(id) {
  console.log(id);
  getAboutMeId = id;
}

// 자기소개서 "추가" 로직 실행 함수
async function aboutMeAdd() {
  // 이벤트 리스너 등록
  const addAboutemeBtn = document.querySelector('#addAboutemeBtn');
  const saveAboutMeBtn = document.querySelector('#saveAboutemeBtn');
  // 유저 이력서 아이디
  const resumeId = await getResumeId();
  if (resumeId.message === '이력서를 작성해주세요.') {
    return;
  }
  // 추가 버튼 이벤트 리스너
  addAboutemeBtn.addEventListener('click', async () => {
    // 다시 한번 resumeId를 확인하고, 이력서 ID가 없는 경우 얼럿을 띄움
    const updatedResumeId = await getUserResume();
    if (!updatedResumeId) {
      alert('먼저 이력서를 작성해주세요.');
      return; // 함수 실행 중단
    }
  });
  // 저장 버튼 이벤트 리스너
  saveAboutMeBtn.addEventListener('click', async () => {
    // 다시 한번 resumeId를 확인하고, 이력서 ID가 없는 경우 얼럿을 띄움
    const updatedResumeId = await getUserResume();
    if (!updatedResumeId) {
      alert('먼저 이력서를 작성해주세요.');
      return; // 함수 실행 중단
    }
    // body값
    const title = document.querySelector('#addExampleFormControlInput1').value;
    const content = document.querySelector(
      '#addExampleFormControlTextarea1',
    ).value;
    // 메인로직
    const aboutMe = await fetch(`/api/aboutmes/${resumeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    // 데이터 가공
    const jsonAboutMe = await aboutMe.json();
    console.log(jsonAboutMe);
    // 예외처리
    if (jsonAboutMe.message) {
      return alert(jsonAboutMe.message);
    }
    // 반환값
    alert(`"${jsonAboutMe.title}" 자기소개서가 추가되었습니다.`);
    window.location.reload();
  });
}

// 자기소개서 "수정" 버튼 클릭 후 "저장" 클릭 시 자기소개서 "수정"로직 실행
async function aboutMeUpdate() {
  const updateAboutMeBtn = document.querySelector('#aboutMeUpdateBtn');
  updateAboutMeBtn.addEventListener('click', async () => {
    // body값
    const title = document.querySelector(
      '#updateExampleFormControlInput1',
    ).value;
    const content = document.querySelector(
      '#updateExampleFormControlTextarea1',
    ).value;
    // 이력서ID 가져오기
    const resumeId = await getResumeId();
    if (resumeId.message === '이력서를 작성해주세요.') {
      return;
    }
    // 자소서 아이디 가져오기
    const aboutMeId = getAboutMeId;

    // 서버로 데이터 요청
    const updateAboutMeData = await fetch(
      `/api/aboutmes/${resumeId}/${aboutMeId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      },
    );
    // 데이터 가공
    const jsonUpdateAboutMeData = await updateAboutMeData.json();
    // 예외처리
    if (jsonUpdateAboutMeData.message) {
      return alert(jsonUpdateAboutMeData.message);
    }
    // 반환값
    alert(`"${jsonUpdateAboutMeData.title}" 자기소개서로 변경되었습니다.`);
    window.location.reload();
  });
}

// 자기소개서 "수정" 버튼 클릭 후 "삭제" 클릭 시 자기소개서 "삭제"로직 실행
function aboutMeDelete() {
  const deleteAboutMeBtn = document.querySelector('#aboutMeDeleteBtn');
  deleteAboutMeBtn.addEventListener('click', async () => {
    // 이력서ID 가져오기
    const resumeId = await getResumeId();
    if (resumeId.message === '이력서를 작성해주세요.') {
      return;
    }
    // 자소서 아이디 가져오기
    const aboutMeId = getAboutMeId;
    // 메인로직
    const deleteAboutMeData = await fetch(
      `/api/aboutmes/${resumeId}/${aboutMeId}`,
      {
        method: 'DELETE',
      },
    );
    // 데이터 가공
    const jsonDeleteAboutMeData = await deleteAboutMeData.json();
    // 예외처리
    if (jsonDeleteAboutMeData.message) {
      return alert(jsonDeleteAboutMeData.message);
    }
    // 반환값
    alert(
      `"${jsonDeleteAboutMeData.title}" 자기소개서가 정상적으로 삭제되었습니다.`,
    );
    // 새로고침
    window.location.reload();
  });
}
