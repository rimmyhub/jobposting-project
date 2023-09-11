const jobpostingId = window.location.pathname.split('/')[2];

// 채용공고 데이터를 HTML에 추가
const titleEl = document.querySelector('.jobposting-title'); // 채용공고 제목
const careerEl = document.querySelector('.jobposting-career'); // 경력 정보
const salaryEl = document.querySelector('.jobposting-salary'); // 급여 정보
const educationEl = document.querySelector('.jobposting-education'); // 학력 정보
const workAreaEl = document.querySelector('.jobposting-work-area'); // 근무지 정보
const workTypeEl = document.querySelector('.jobposting-work-type'); // 근무형태 정보
const contentEl = document.querySelector('.jobposting-content'); // 채용공고 설명

// 해당 아이디의 채용공고 화면에 띄우기
async function getJobposting() {
  try {
    // 회사 정보 가져오기
    const response = await fetch(`/api/jobpostings/${jobpostingId}`);
    const data = await response.json();

    // 기업 정보 보기 버튼
    const companyInfo = document.querySelector('.company-info');

    companyInfo.addEventListener('click', () => {
      const companyId = data.companyId;
      window.location.href = `/company/${companyId}`;
    });

    titleEl.textContent = data.title;
    careerEl.textContent = data.career;
    salaryEl.textContent = data.salary;
    educationEl.textContent = data.education;
    workAreaEl.textContent = data.workArea;
    workTypeEl.textContent = data.workType;
    contentEl.textContent = data.content;
  } catch (error) {
    console.error(error);
  }
}
getJobposting();

// 지원하기 버튼
const applyBtn = document.querySelector('.apply-btn');
applyBtn.addEventListener('click', async (event) => {
  try {
    const response = await fetch(`/api/applications/${jobpostingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('성공적으로 지원하였습니다.');
    } else if (response.status === 500) {
      const data = await response.json();
      alert('로그인이 필요합니다.');
      window.location.href = '/signup';
      return;
    } else if (response.status === 403) {
      const data = await response.json();
      alert(data.message);
    } else {
      alert('오류가 발생했습니다.');
    }
  } catch (error) {
    console.error(error);
    alert('예기치 않은 오류가 발생했습니다.');
  }
});
