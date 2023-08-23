document.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault();
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
});

// 유저 정보를 불러오는 함수 로직
async function getUserData() {
  const userData = await fetch(`/api/users/user-page`);

  const jsonUserData = userData.json();
  await jsonUserData.then((result) => {
    console.log(result);
  });
}

// 유저의 이력서를 불러오는 함수 로직
async function getUserResume() {
  const resumeTitleTag = document.querySelector('#resumeTitle');
  const resumeDescTag = document.querySelector('#resumeDesc');
  resumeTitleTag.innerHTML = '';
  resumeDescTag.innerHTML = '';

  // 로그인 기능이 실현될 시에 해당 코드 활성화
  // const params = new URLSearchParams(window.location.search);
  // const resumeId = params.get('ID');

  // 일단 테스트 단계라 하드코딩함
  const resumeId = 32;
  // 만들어둔 이력서 조회 API fetch 요청 보냄
  const userResumeData = await fetch(`/api/resumes/${resumeId}`);
  // 받아온 데이터 할당
  const responseData = await userResumeData.json();

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
}

// 유저의 학력을 불러오는 함수 로직
async function getUserEducation() {
  const educationBox = document.querySelector('#educationBox');
  // 로그인 기능이 실현될 시에 해당 코드 활성화
  // const params = new URLSearchParams(window.location.search);
  // const resumeId = params.get('ID');

  educationBox.innerHTML = '';

  // 테스트용 하드코딩
  const resumeId = 32;

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
  // const params = new URLSearchParams(window.location.search);
  // const resumeId = params.get('ID');

  careerBox.innerHTML = '';

  // 테스트용 하드코딩
  const resumeId = 32;

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
  // const params = new URLSearchParams(window.location.search);
  // const resumeId = params.get('ID');

  portfolioBox.innerHTML = '';

  // 테스트용 하드코딩
  const resumeId = 32;

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
  // const params = new URLSearchParams(window.location.search);
  // const resumeId = params.get('ID');

  aboutMeBox.innerHTML = '';

  // 테스트용 하드코딩
  const resumeId = 32;

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
