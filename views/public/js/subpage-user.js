document.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault();
  // 유저 정보를 불러오는 함수를 실행
  getUserData();
});

// 유저 정보를 불러오는 함수 로직
async function getUserData() {
  const params = new URLSearchParams(window.location.search);
  const resumeId = params.get('ID');

  const userData = await fetch(`api/resumes/${resumeId}`);

  const jsonUserData = userData.json();
  jsonUserData.then((result) => {
    console.log(result);
  });
}
