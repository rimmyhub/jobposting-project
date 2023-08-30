// 페이지 로드시 실행 함수
document.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault();
  init();
});

// 유저 이미지 수정하기
const userImage = document.getElementById('image');
const imageUploadEl = document.getElementById('user-image');
const imageDeleteEl = document.getElementById('image-delete');

console.dir(userImage);
console.dir(imageUploadEl);
console.dir(imageDeleteEl);

imageUploadEl.addEventListener('change', async (e) => {
  const selectedFile = e.target.files[0];

  console.log(selectedFile);

  if (selectedFile.size > 1 * 1024 * 1024) {
    alert('파일용량은 최대 1MB입니다.');
    return;
  }
  console.log(selectedFile.size);
  if (
    !selectedFile.type.includes('jpeg') &&
    !selectedFile.type.includes('png')
  ) {
    alert('jpeg 또는 png 파일만 업로드 가능합니다!');
    return;
  }
  const formData = new FormData();
  formData.append('file', selectedFile);
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  console.log(data);

  imageUrl = data.url;

  userImage.setAttribute('src', imageUrl);
});

// 기본프로필 적용하기
imageDeleteEl.addEventListener('click', () => {
  url = '';
  userImage.setAttribute('src', '/img/profile.jpg');
});

// Get 요청 함수 모음
function init() {
  // 유저 데이터
  getUserData();
  // 유저 이력서
  getUserResume();
  // 유저 학력
  getUserEducation();
  // 유저 경력
  getUserCareer();
  // 유저 포트폴리오
  getUserPortfolio();
  // 유저 자기소개서
  getUserAboutMe();
}

// 해당 유저의 모든 데이터를 긁어오는 함수
async function getAllData() {
  const userId = '';
  const userAllData = await fetch(`/api/users/${userId}/mypage`);
  const resUserAllData = await userAllData.json();
  console.log(resUserAllData);

  data = [];
  data.forEach(() => {
    // userId == > 유저, 이력서, 학력, 경력 , 포트폴리오, 자기소개 다 불러올 수 있나?
  });
}

// 유저 정보를 불러오는 함수 로직
async function getUserData() {
  const userInfoBox = document.querySelector('#userInfoBox');
  const profileBox = document.querySelector('.profile-box');
  // 테스트용 하드코딩
  const userId = 6;
  // 메인로직
  const userData = await fetch(`/api/users/user/${userId}`);
  // 데이터 가공
  const jsonUserData = await userData.json();
  // 붙여넣기
  userInfoBox.innerHTML = `
 <div class="col-sm-8" id="userInfoBox">
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

  // 이미지 보여주기
  profileBox.innerHTML = `
  <div class="profile-box">
     <img
       src="${jsonUserData.image}"
       id="image"
       class="user-img"
       alt=""
       srcset=""
     />
     <i class="fa-solid fa-pen edit-icon" style="color: #0d6efd">수정</i>
     <input
       id="user-image"
       class="img-file"
       type="file"
       accept="image/jpeg, image/png"
     />
  </div>
`;
}

// 유저의 이력서를 불러오는 함수 로직
async function getUserResume() {
  const resumeBox = document.querySelector('#resumeBox');

  // 로그인 기능이 실현될 시에 해당 코드 활성화
  // const params = new URLSearchParams(window.location.search);
  // const resumeId = params.get('ID');

  // 일단 테스트 단계라 하드코딩함
  const resumeId = 1;
  // 만들어둔 이력서 조회 API fetch 요청 보냄
  const userResumeData = await fetch(`/api/resumes/${resumeId}`);
  // 받아온 데이터 할당
  const responseData = await userResumeData.json();
  // 예외 처리
  if (responseData.message) {
    return alert(responseData.message);
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
  const resumeId = 1;
  // 서버에게 데이터 요청
  const userEducationData = await fetch(`/api/educations/${resumeId}`);
  // 데이터 가공
  const jsonUserEducationData = await userEducationData.json();

  // 예외처리
  if (jsonUserEducationData.message) {
    return alert(jsonUserEducationData.message);
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

  // 테스트용 하드코딩
  const resumeId = 1;
  // 서버요청
  const userCareerData = await fetch(`/api/careers/${resumeId}`);
  // 데이터가공
  const jsonUserCareerData = await userCareerData.json();
  // 예외처리
  if (jsonUserCareerData.message) {
    return alert(jsonUserCareerData.message);
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
  </div>
  <button
            type="button"
            class="btn btn-primary fa-solid fa-pen"
            data-bs-toggle="modal"
            data-bs-target="#career"
          >
            수정
          </button>`;
  });
}

// 유저의 포트폴리오를 불러오는 함수 로직
async function getUserPortfolio() {
  const portfolioBox = document.querySelector('#portfolioBox');

  // 로그인 기능이 실현될 시에 해당 코드 활성화
  // const params = new URLSearchParams(window.location.search);
  // const resumeId = params.get('ID');

  // 테스트용 하드코딩
  const resumeId = 1;
  // 서버요청
  const userPortfolio = await fetch(`/api/portfolio/${resumeId}`);
  // 가공
  const jsonUserPortfolio = await userPortfolio.json();
  // 예외처리
  if (jsonUserPortfolio.message) {
    return alert(jsonUserPortfolio.message);
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
  </div>
  <button
            type="button"
            class="btn btn-primary fa-solid fa-pen"
            data-bs-toggle="modal"
            data-bs-target="#portfolio"
          >
            수정
          </button>`;
  });
}

// 유저의 자기소개서를 불러오는 함수 로직
async function getUserAboutMe() {
  const aboutMeBox = document.querySelector('#aboutMeBox');

  // 로그인 기능이 실현될 시에 해당 코드 활성화
  // const params = new URLSearchParams(window.location.search);
  // const resumeId = params.get('ID');

  // 테스트용 하드코딩
  const resumeId = 1;
  // 서버 요청
  const userAboutMe = await fetch(`/api/aboutmes/${resumeId}`);
  // 데이터 가공
  const jsonUserAboutMe = await userAboutMe.json();
  // 예외처리
  if (jsonUserAboutMe.message) {
    return alert(jsonUserAboutMe.message);
  }
  // 메인로직 실행
  aboutMeBox.innerHTML = '';
  jsonUserAboutMe.forEach((aboutMeInfo) => {
    aboutMeBox.innerHTML += `<div class="col-sm-8" id="aboutMeBox">
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
  </div>
  <button
            type="button"
            class="btn btn-primary fa-solid fa-pen"
            data-bs-toggle="modal"
            data-bs-target="#aboutme"
          >
            수정
          </button>`;
  });
}

// 이력서 "수정" 버튼 클릭 후 "저장" 누를 시 이력서 "수정" 로직 실행 함수
const updateBtn = document.querySelector('#updateResumeBtn');
updateBtn.addEventListener('click', async (e) => {
  // body value
  const title = document.querySelector('#title').value;
  const content = document.querySelector('#content').value;
  // 테스트용 하드코딩
  const resumeId = 1;
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

// 이력서 "수정" 버튼 클릭 후 "삭제" 누를 시 이력서 "삭제" 로직 실행 함수
const deleteResumeBtn = document.querySelector('#deleteResumeBtn');
deleteResumeBtn.addEventListener('click', async (e) => {
  // 테스트용 하드코딩
  const resumeId = 1;
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

// 개인정보 "수정" 버튼 클릭 후 "저장" 버튼 클릭 시 "수정" 로직 실행 함수
// 아직 userId 가져오는 url이 없어서 아직 구현 안됨.
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
  console.log(jsonUserUpdateData);
  // window.location.reload();
});

// 학력 "추가" 버튼 클릭 후 "저장" 버튼 클릭 시 학력 "추가" 로직 실행 함수
const addEducationBtn = document.querySelector('#educationSaveBtn');
addEducationBtn.addEventListener('click', async () => {
  // body값
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

// 학력 "수정" 버튼 클릭 후 "저장" 버튼 클릭 시 학력 "수정" 로직 실행 함수
const educationUpdateBtn = document.querySelector('#educationUpdateBtn');
educationUpdateBtn.addEventListener('click', async () => {
  // 바디값
  const schoolTitle = document.querySelector('#schoolTitleUpdateTag').value;
  const major = document.querySelector('#majorUpdateTag').value;
  const admissionYear = document.querySelector('#admissionYearUpdateTag').value;
  const graduationYear = document.querySelector(
    '#graduationYearUpdateTag',
  ).value;
  // 테스트용 하드코딩
  const educationId = 2;

  // 학력 등록 로직
  const dropdownItems = document.querySelectorAll('.item');
  const selectedValueElement = document.getElementById('selectedValue');

  const educationPick = (dropdownItems) => {
    const eduPick = dropdownItems.forEach((item) => {
      item.addEventListener('click', () => {
        const selectedText = item.textContent;
        selectedValueElement.textContent = selectedText;
        console.log(selectedText);
        return selectedText;
      });
    });
    return eduPick;
  };
  // 함수 결과물 확인 로직
  const education = educationPick(dropdownItems);
  console.log(education);
  // 서버요청
  const educationUpdateData = await fetch(`/api/educations/${educationId}`, {
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

// 학력 "수정" 버튼 클릭 후 "삭제" 버튼 클릭 시 학력 "삭제" 로직 실행 함수
// 생각할것 해당 학력을 어떻게 삭제할건지... api 자체는 /api/educations/:educationId
// educationId 어디서 받아오냐...??????
const educationDeleteBtn = document.querySelector('#educationDeleteBtn');
educationDeleteBtn.addEventListener('click', async (e) => {
  // 하드코딩용
  const educationId = 2;
  // 메인로직
  const deleteEducationData = await fetch(`/api/educations/${educationId}`, {
    method: 'delete',
  });
  const jsonDeleteEducationData = await deleteEducationData.json();
  // 사용자에 표시
  alert(jsonDeleteEducationData.message);
  // 새로고침
  window.location.reload();
});

// 경력부분에서 "추가" 버튼 클릭 후 "저장" 버튼 클릭 시 경력 "생성" 하는 로직
const addCareerBtn = document.querySelector('#addCareerBtn');
addCareerBtn.addEventListener('click', async () => {
  // 각 value값 가져오기
  const companyTitle = document.querySelector('#addCompanyTitle').value;
  const job = document.querySelector('#addJob').value;
  const joiningDate = document.querySelector('#addJoiningDate').value;
  const resignationDate = document.querySelector('#addResignationDate').value;
  const position = document.querySelector('#addPosition').value;

  // 테스팅용
  const resumeId = 1;
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

// 경력부분 "수정" 버튼의 "저장"버튼 클릭시 경력 "수정"로직 실행
const updateCareerBtn = document.querySelector('#updateCareerBtn');
updateCareerBtn.addEventListener('click', async () => {
  // 각 밸류값들
  const companyTitle = document.querySelector('#careerUpdateName').value;
  const position = document.querySelector('#careerUpdatePosition').value;
  const job = document.querySelector('#updateCareerJob').value;
  const joiningDate = document.querySelector('#updateCareerJoiningDate').value;
  const resignationDate = document.querySelector(
    '#updateCareerResignationDate',
  ).value;
  //테스팅용 하드코딩
  const careerId = 3;
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

// 경력부분 "수정" 버튼의 "삭제"버튼 클릭시 경력 "삭제"로직 실행
const deleteCareerBtn = document.querySelector('#deleteCareerBtn');
deleteCareerBtn.addEventListener('click', async () => {
  // 테스팅용 하드코딩
  const careerId = 4;
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

// 포트폴리오 "추가" 버튼을 누른 후 "저장"버튼 클릭시 포트폴리오 "작성" 로직 실행
const addPortfolioBtn = document.querySelector('#addPortfolioBtn');
addPortfolioBtn.addEventListener('click', async () => {
  // 바디 밸류값 가져오기
  const address = document.querySelector('#addURLTag').value;
  const file = document.querySelector('#formFile').value;
  // 테스팅용 하드코딩
  const resumeId = 1;
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

// 포트폴리오 "수정" 버튼 클릭 후 "저장"버튼 클릭시 포트폴리오 "수정"로직 실행
const updatePortfolioBtn = document.querySelector('#updatePortfolioBtn');
updatePortfolioBtn.addEventListener('click', async () => {
  // 필요 밸류값 가져오기
  const address = document.querySelector('#updateURL').value;
  const file = document.querySelector('#formFile-1').value;
  // 테스팅용 하드코딩
  const resumeId = 1;
  const portfolioId = 1;
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

// 포트폴리오 "수정" 버튼 클릭 후 "삭제"버튼 클릭시 포트폴리오 "삭제"로직 실행
const deletePortfolioBtn = document.querySelector('#deletePortfolioBtn');
deletePortfolioBtn.addEventListener('click', async () => {
  // 테스트용 하드코딩
  const resumeId = 1;
  const portfolioId = 2;
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

// 자기소개서 "추가" 버튼 클릭 시 자기소개서 "작성" 로직 실행
const addAboutMeBtn = document.querySelector('#addAboutMeBtn');
addAboutMeBtn.addEventListener('click', async () => {
  // body값
  const title = document.querySelector('#addExampleFormControlInput1').value;
  const content = document.querySelector(
    '#addExampleFormControlTextarea1',
  ).value;
  // 테스트용 하드코딩
  const resumeId = 1;
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

// 자기소개서 "수정" 버튼 클릭 후 "저장" 클릭 시 자기소개서 "수정"로직 실행
const updateAboutMeBtn = document.querySelector('#aboutMeUpdateBtn');
updateAboutMeBtn.addEventListener('click', async () => {
  // body값
  const title = document.querySelector('#updateExampleFormControlInput1').value;
  const content = document.querySelector(
    '#updateExampleFormControlTextarea1',
  ).value;
  // 테스트용 하드코딩
  const resumeId = 1;
  const aboutmeId = 3;
  // 메인로직
  const updateAboutMeData = await fetch(
    `/api/aboutmes/${resumeId}/${aboutmeId}`,
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

// 자기소개서 "수정" 버튼 클릭 후 "삭제" 클릭 시 자기소개서 "삭제"로직 실행
const deleteAboutMeBtn = document.querySelector('#aboutMeDeleteBtn');
deleteAboutMeBtn.addEventListener('click', async () => {
  // 테스트용 하드코딩
  const resumeId = 1;
  const aboutmeId = 4;
  // 메인로직
  const deleteAboutMeData = await fetch(
    `/api/aboutmes/${resumeId}/${aboutmeId}`,
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
