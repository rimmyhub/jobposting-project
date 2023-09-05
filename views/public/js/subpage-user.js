let btnContainer;
document.addEventListener('DOMContentLoaded', (e) => {
  btnContainer = document.getElementById('btn-container');
  e.preventDefault();
  // 유저 정보를 불러오는 함수를 실행
  getUserData();
  // 유저 이력서 정보를 불러오는 함수 실행
  getUserResume();
  // 유저의 학력을 불러오는 함수 실행
  getUserEducation();
  // 유저의 경력을 불러오는 함수 실행
  getUserCareer();
  // 유저의 포트폴리오를 불러오는 함수 실행
  getUserPortfolio();
  // 유저의 자기소개서를 불러오는 함수 실행
  getUserAboutMe();

  // 유저인지 회사인지 판단
  hideBtn();
});

// 메세지보내기버튼 숨기기
function hideBtn() {
  const type = window.localStorage.getItem('type');
  if (type) {
    console.log('버튼 숨기기', btnContainer);
    btnContainer.style.display = 'none';
  }
}

// 유저 정보를 불러오는 함수 로직
async function getUserData() {
  const userBox = document.querySelector('#userBox');

  // userId 채취
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id');
  const resumeId = params.get('resumeId');

  // 학력 데이터 가공
  const userEducationData = await fetch(`/api/educations/${resumeId}`);
  const jsonUserEducationData = await userEducationData.json();
  console.log(jsonUserEducationData);

  // 학력이 없을 경우 예외처리
  if (
    jsonUserEducationData.message ===
    `현재 작성하신 이력서에 <학력>은 작성 전 입니다.`
  ) {
    userBox.innerHTML = `<p>해당 이력서에 (학력란)을 작성하시면 이 곳이 오픈 됩니다.</p>`;
    return;
  }

  // 유저 데이터 가공
  const userData = await fetch(`/api/users/user/${userId}`);
  const jsonUserData = await userData.json();

  // 이력서 데이터 가공
  const userResumeData = await fetch(`/api/resumes/${resumeId}`);
  const jsonUserResumeData = await userResumeData.json();

  // 위의 3가지 내용이 전부 조회가 될 경우 innerHTML 실행
  userBox.innerHTML = '';

  userBox.innerHTML = `<div class="col" id="userBox">
                        <img
                          src="/img/userImg.jpg"
                          class="rounded-circle border border-secondary"
                          alt="..."
                          style="width: 150px"
                        />
                        <p class="fs-2 fw-semibold" style="margin: 10px">${jsonUserData.name}</p>
                        <p class="fs-4" style="margin: 10px">${jsonUserResumeData.title}</p>
                        <p class="fw-normal" style="margin: 10px">
                          ${jsonUserEducationData[0].major}ᆞ${jsonUserEducationData[0].schoolTitle}
                        </p>
                        <p class="fw-normal" style="margin: 10px">
                          ${jsonUserData.address}ᆞ${jsonUserData.phone}
                        </p>
                      </div>`;
}

// 유저의 이력서를 불러오는 함수 로직
async function getUserResume() {
  const resumeTitleTag = document.querySelector('#resumeTitle');
  const resumeDescTag = document.querySelector('#resumeDesc');
  const userInfoBox = document.querySelector('#userInfoBox');

  resumeTitleTag.innerHTML = '';
  resumeDescTag.innerHTML = '';

  // 로그인 기능이 실현될 시에 해당 코드 활성화
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id');
  const resumeId = params.get('resumeId');

  // 만들어둔 이력서 조회 API fetch 요청 보냄
  const userResumeData = await fetch(`/api/resumes/${resumeId}`);
  // 받아온 데이터 할당
  const responseData = await userResumeData.json();

  // 메인 로직
  resumeTitleTag.innerHTML = `<p
                                  class="fs-2 fw-semibold text-start information"
                                  id="resumeTitle"
                                  style="margin: 10px"
                                  >
                                  ${responseData.title}
                                </p>`;

  resumeDescTag.innerHTML = `<p class="text-start" id="resumeDesc">
                                ${responseData.content}
                              </p>`;

  // 유저 정보 조회 fetch
  const userData = await fetch(`/api/users/user/${userId}`);
  const jsonUserData = await userData.json();

  userInfoBox.innerHTML = `<div id="userInfoBox">
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
}

// 유저의 학력을 불러오는 함수 로직
async function getUserEducation() {
  const educationBox = document.querySelector('#educationBox');
  // 로그인 기능이 실현될 시에 해당 코드 활성화
  const params = new URLSearchParams(window.location.search);
  const resumeId = params.get('resumeId');

  educationBox.innerHTML = '';

  const userEducationData = await fetch(`/api/educations/${resumeId}`);

  const jsonUserEducationData = await userEducationData.json();
  jsonUserEducationData.forEach((educationInfo) => {
    educationBox.innerHTML += `<div class="col-sm-8" id="educationBox">
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
        <p class="text-start text-body-secondary">입학연도</p>
        </div>
        <div class="col-sm-8">
        <p class="text-start">${educationInfo.admissionYear}</p>
        </div>
    </div>
    <!-- 입학년도 -->

    <!-- 졸업년도 -->
    <div class="row">
        <div class="col-sm-4">
        <p class="text-start text-body-secondary">졸업연도</p>
        </div>
        <div class="col-sm-8">
        <p class="text-start">${educationInfo.graduationYear}</p>
        </div>
    </div>
    <!-- 졸업년도 -->
                               </div>`;
  });
}

// 유저의 경력을 불러오는 함수 로직
async function getUserCareer() {
  const careerBox = document.querySelector('#careerBox');

  // 로그인 기능이 실현될 시에 해당 코드 활성화
  const params = new URLSearchParams(window.location.search);
  const resumeId = params.get('resumeId');

  careerBox.innerHTML = '';

  const userCareerData = await fetch(`/api/careers/${resumeId}`);

  const jsonUserCareerData = await userCareerData.json();
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
                            </div>`;
  });
}
// 유저의 포트폴리오를 불러오는 함수 로직
async function getUserPortfolio() {
  const portfolioBox = document.querySelector('#portfolioBox');

  // 로그인 기능이 실현될 시에 해당 코드 활성화
  const params = new URLSearchParams(window.location.search);
  const resumeId = params.get('resumeId');

  portfolioBox.innerHTML = '';

  const userPortfolio = await fetch(`/api/portfolio/${resumeId}`);

  const jsonUserPortfolio = await userPortfolio.json();

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
                                </div>`;
  });
}

// 유저의 자기소개서를 불러오는 함수 로직
async function getUserAboutMe() {
  const aboutMeBox = document.querySelector('#aboutMeBox');

  // 로그인 기능이 실현될 시에 해당 코드 활성화
  const params = new URLSearchParams(window.location.search);
  const resumeId = params.get('resumeId');

  aboutMeBox.innerHTML = '';

  const userAboutMe = await fetch(`/api/aboutmes/${resumeId}`);

  const jsonUserAboutMe = await userAboutMe.json();
  jsonUserAboutMe.forEach((aboutMeInfo) => {
    aboutMeBox.innerHTML = `<div class="col-sm-8" id="aboutMeBox">
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
                              </div>`;
  });
}
