document.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault();
  // 유저 정보를 불러오는 함수를 실행
  getUserData();
  // 유저 이력서 정보를 불러오는 함수 실행
  getUserResume();
  // 유저의 학력을 불러오는 함수 실행
  getUserEducation();
  // 유저의 경력을 불러오는 함수 실행
  // getUserCareer();
  // 유저의 포트폴리오를 불러오는 함수 실행
  // getUserPortfolio();
  // 유저의 자기소개서를 불러오는 함수 실행
  // getUserAboutMe();
});

// 유저 정보를 불러오는 함수 로직
async function getUserData() {
  const userInfoBox = document.querySelector('#userInfoBox');

  const userId = 1;
  const userData = await fetch(`/api/users/user/${userId}`);

  const jsonUserData = await userData.json();

  userInfoBox.innerHTML = `<div class="col-sm-8" id="userInfoBox">
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
}

// 유저의 이력서를 불러오는 함수 로직
async function getUserResume() {
  const resumeBox = document.querySelector('#resumeBox');

  // 로그인 기능이 실현될 시에 해당 코드 활성화
  // const params = new URLSearchParams(window.location.search);
  // const resumeId = params.get('ID');

  // 일단 테스트 단계라 하드코딩함
  const resumeId = 4;
  // 만들어둔 이력서 조회 API fetch 요청 보냄
  const userResumeData = await fetch(`/api/resumes/${resumeId}`);
  // 받아온 데이터 할당
  const responseData = await userResumeData.json();
  // 예외 처리
  if (
    responseData.message === '이력서가 존재하지 않습니다. 이력서를 작성하세요.'
  ) {
    alert(responseData.message);
    return;
  }
  resumeBox.innerHTML = '';
  // 메인 로직
  resumeBox.innerHTML = `<div class="col-sm-8" id="resumeBox">
                        <p
                            class="fs-2 fw-semibold text-start information"
                            style="margin: 10px"
                        >
                            ${responseData.title}
                        </p>
                        <p class="text-start">
                            ${responseData.content}
                        </p>
                        <!-- 구분선 -->
                        <hr />
                        </div>`;
}

// 유저의 학력을 불러오는 함수 로직
async function getUserEducation() {
  const educationBox = document.querySelector('#educationBox');
  // 로그인 기능이 실현될 시에 해당 코드 활성화
  // const params = new URLSearchParams(window.location.search);
  // const resumeId = params.get('ID');

  // 테스트용 하드코딩
  const resumeId = 4;

  const userEducationData = await fetch(`/api/educations/${resumeId}`);

  const jsonUserEducationData = await userEducationData.json();

  // 예외처리
  if (
    jsonUserEducationData.message === '현재 이력서에 등록된 (학력)이 없습니다.'
  ) {
    alert(jsonUserEducationData.message);
    return;
  }

  // 예외처리에 걸러지지 않았다면 메인로직 실행
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
  </div>
  
  <button
            type="button"
            class="btn btn-primary fa-solid fa-pen"
            data-bs-toggle="modal"
            data-bs-target="#education"
          >
            수정
          </button>`;
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
  const resumeId = 1;

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
  const resumeId = 1;

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
  const resumeId = 1;

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
    <!-- 수정 아이콘 -->
  </div>`;
  });
}

// 이력서 수정 버튼 클릭 후 "저장" 누를 시 이력서 수정 로직 실행 함수
const updateBtn = document.querySelector('#updateResumeBtn');
updateBtn.addEventListener('click', async (e) => {
  const title = document.querySelector('#title').value;
  const content = document.querySelector('#content').value;
  // 테스트용 하드코딩
  const resumeId = 1;

  const updateResumeData = await fetch(`/api/resumes/${resumeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });

  const jsonUpdateResumeData = await updateResumeData.json();
  // 사용자에게 알림
  jsonUpdateResumeData.message
    ? alert(`수정할 이력서의 제목과 내용을 입력해 주세요.`)
    : alert(`${jsonUpdateResumeData.title} 로 이력서를 수정하였습니다.`);
  // 로직 종료 후 창 새로고침
  window.location.reload();
});

// 이력서 수정 버튼 클릭 후 "삭제" 누를 시 이력서 삭제 로직 실행 함수
const deleteResumeBtn = document.querySelector('#deleteResumeBtn');
deleteResumeBtn.addEventListener('click', async (e) => {
  const resumeId = 3;

  const removeData = await fetch(`/api/resumes/${resumeId}`, {
    method: 'DELETE',
  });
  const jsonRemoveData = await removeData.json();
  alert(jsonRemoveData.message);
  window.location.reload();
});

// 개인정보 수정 버튼 클릭 후 "저장" 버튼 클릭 시 수정 로직 실행 함수
const userUpdateBtn = document.querySelector('#userUpdateBtn');
userUpdateBtn.addEventListener('click', async () => {
  const name = document.querySelector('#userNameTag').value;
  const email = document.querySelector('#userEmailTag').value;
  const phone = document.querySelector('#userPhoneTag').value;
  const gender = document.querySelector('#userGenderTag').value;
  const address = document.querySelector('#userAddressTag').value;
  const birth = document.querySelector('#userBirthTag').value;

  const userUpdateData = await fetch(`/api/users`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, gender, address, birth }),
  });
  const jsonUserUpdateData = await userUpdateData.json();
  console.log(jsonUserUpdateData);
  // window.location.reload();
});

// 학력 추가 버튼 클릭 후 "저장" 버튼 클릭 시 학력 추가 로직 실행 함수
const addEducationBtn = document.querySelector('#educationSaveBtn');
addEducationBtn.addEventListener('click', async () => {
  const schoolTitle = document.querySelector('#schoolNameTag').value;
  const major = document.querySelector('#majorTag').value;
  const admissionYear = document.querySelector('#admissionYearTag').value;
  const graduationYear = document.querySelector('#graduationYearTag').value;

  // 테스트용 하드코딩
  const resumeId = 4;

  // 데이터 보내기
  const addEducationData = await fetch(`/api/educations/${resumeId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      schoolTitle,
      major,
      admissionYear,
      graduationYear,
      education: 'ElementarySchool',
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

// 학력 수정 버튼 클릭 후 "저장" 버튼 클릭 시 학력 수정 로직 실행 함수
const educationUpdateBtn = document.querySelector('#educationUpdateBtn');

educationUpdateBtn.addEventListener('click', async () => {
  const schoolTitle = document.querySelector('#schoolTitleUpdateTag').value;
  const major = document.querySelector('#majorUpdateTag').value;
  const admissionYear = document.querySelector('#admissionYearUpdateTag').value;
  const graduationYear = document.querySelector(
    '#graduationYearUpdateTag',
  ).value;

  const educationId = 3;

  const educationUpdateData = await fetch(`/api/educations/${educationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      schoolTitle,
      major,
      admissionYear,
      graduationYear,
      education: 'ElementarySchool',
    }),
  });
  // 가져온 데이터 가공
  const jsonEducationUpdateData = await educationUpdateData.json();
  // 예외처리
  if (jsonEducationUpdateData.message) {
    alert(jsonEducationUpdateData.message);
    return;
  }
  alert(
    `${jsonEducationUpdateData.education} 학력이 정상적으로 수정 되었습니다.`,
  );
  window.location.reload();
});

//
