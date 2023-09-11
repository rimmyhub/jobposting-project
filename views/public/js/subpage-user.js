let btnContainer;
document.addEventListener('DOMContentLoaded', (e) => {
  btnContainer = document.getElementById('btn-container');
  e.preventDefault();
  init();
  // 유저인지 회사인지 판단
  hideBtn();
});
// URI 자원
const params = new URLSearchParams(window.location.search);
const userId = params.get('id');
const resumeId = params.get('resumeId');

// init 함수
function init() {
  // 유저 정보를 불러오는 함수를 실행
  // getUserData();
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
}
// 메세지보내기버튼 숨기기
function hideBtn() {
  const type = window.localStorage.getItem('type');
  if (type === 'user') {
    // console.log('버튼 숨기기', btnContainer);
    btnContainer.style.display = 'none';
  }
}
// 유저의 종합정보를 불러오는 함수 로직
// async function getUserData() {
//   const userBox = document.querySelector('#userBox');
//   const edu = document.querySelector('#educationBar');
//   const user = document.querySelector('#userInfoBar');
//   const resume = document.querySelector('#userInfoBar');

//   // 학력 데이터 가공
//   const userEducationData = await fetch(`/api/educations/${resumeId}`);
//   const jsonUserEducationData = await userEducationData.json();
//   if (!jsonUserEducationData.message) {
//     edu.innerHTML = `
//                     <p class="fw-normal" id="educationBar" style="margin: 10px">
//                       ${jsonUserEducationData[0].title}
//                     </p>
//   `;
//   }
//   // 유저 데이터 가공
//   const userData = await fetch(`/api/users/user/${userId}`);
//   const jsonUserData = await userData.json();
//   if (!jsonUserData.message) {
//     user.innerHTML = `
//                       <p class="fw-normal" id="userInfoBar" style="margin: 10px">
//                         <!-- ${jsonUserData.address}ᆞ${jsonUserData.phone} -->
//                       </p>
//                      `;
//   }

//   // 이력서 데이터 가공
//   const userResumeData = await fetch(`/api/resumes/${resumeId}`);
//   const jsonUserResumeData = await userResumeData.json();
//   if (!jsonUserResumeData.message) {
//     resume.innerHTML = ``;
//   }

//   // 예외처리
//   if (
//     jsonUserData.message ||
//     jsonUserResumeData.message ||
//     jsonUserEducationData.message
//   ) {
//     return console.log(
//       jsonUserData.message,
//       jsonUserResumeData.message,
//       jsonUserEducationData.message,
//     );
//   } else if (
//     !jsonUserData.message &&
//     !jsonUserResumeData.message &&
//     !jsonUserEducationData.message
//   ) {
//   }
// }
// 유저의 이력서를 불러오는 함수 로직
async function getUserResume() {
  // 이미지 태그
  const userBox = document.querySelector('#userBox');
  // 이력서태그
  const resumeTitleTag = document.querySelector('#resumeTitle');
  const resumeDescTag = document.querySelector('#resumeDesc');
  // 유저정보태그
  const userInfoBox = document.querySelector('#userInfoBox');
  // 만들어둔 이력서 조회 API fetch 요청 보냄
  const userResumeData = await fetch(`/api/resumes/${resumeId}`);
  // 받아온 데이터 할당
  const responseData = await userResumeData.json();
  console.log('responseData = ', responseData);
  // 예외처리
  if (responseData.message) {
    return console.log(responseData.message);
  }
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
  console.log('jsonUserData', jsonUserData);
  // 예외처리
  if (jsonUserData.message) {
    return console.log(jsonUserData.message);
  }

  // innerHTML
  userBox.innerHTML = `
                    <div class="col" id="userBox">
                    <img
                      src="${jsonUserData.image}"
                      class="rounded-circle border border-secondary"
                      alt="..."
                      style="width: 150px"
                    />
                    <p class="fs-2 fw-semibold" style="margin: 10px">${jsonUserData.name}</p>
                  </div>
                    `;

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

  const userEducationData = await fetch(`/api/educations/${resumeId}`);

  const jsonUserEducationData = await userEducationData.json();

  if (jsonUserEducationData.message) {
    return console.log(jsonUserEducationData.message);
  }
  educationBox.innerHTML = '';

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

  const userCareerData = await fetch(`/api/careers/${resumeId}`);

  const jsonUserCareerData = await userCareerData.json();

  if (jsonUserCareerData.message) {
    return console.log(jsonUserCareerData.message);
  }

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
                            </div>`;
  });
}
// 유저의 포트폴리오를 불러오는 함수 로직
async function getUserPortfolio() {
  const portfolioBox = document.querySelector('#portfolioBox');

  const userPortfolio = await fetch(`/api/portfolio/${resumeId}`);

  const jsonUserPortfolio = await userPortfolio.json();

  if (jsonUserPortfolio.message) {
    return console.log(jsonUserPortfolio.message);
  }

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
                                </div>`;
  });
}
// 유저의 자기소개서를 불러오는 함수 로직
async function getUserAboutMe() {
  const aboutMeBox = document.querySelector('#aboutMeBox');

  const userAboutMe = await fetch(`/api/aboutmes/${resumeId}`);

  const jsonUserAboutMe = await userAboutMe.json();

  if (jsonUserAboutMe.message) {
    return console.log(jsonUserAboutMe.message);
  }

  aboutMeBox.innerHTML = '';

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
