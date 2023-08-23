document.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault();
  // 유저 정보를 불러오는 함수를 실행
  //   getUserData();
  // 유저 이력서 정보를 불러오는 함수 실행
  getUserResume();
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
  // 로그인 기능이 실현될 시에 해당 코드 활성화
  // const params = new URLSearchParams(window.location.search);
  // const resumeId = params.get('ID');

  const resumeId = 29;

  const userResumeData = await fetch(`/api/resumes/${resumeId}`);

  const jsonUserResumeData = await userResumeData.json();

  console.log(jsonUserResumeData);
}
