const jobpostingId = window.location.pathname.split('/')[3];
console.log(jobpostingId);
// 채용공고 수정
const modifyBtn = document.querySelector('#jobposting-modify-btn');
const titleInfo = document.querySelector('#modify-title-info');
const careerInfo = document.querySelector('#modify-career-info');
const salaryInfo = document.querySelector('#modify-salary-info');
const educationInfo = document.querySelector('#modify-education-info');
const jobInfo = document.querySelector('#modify-job-info');
const workareaInfo = document.querySelector('#modify-workarea-info');
const worktypeInfo = document.querySelector('#modify-worktype-info');
const duedateInfo = document.querySelector('#modify-duedate-info');
const contentInfo = document.querySelector('#modify-content-info');

// 수정

// 채용공고 정보 보여주기
async function getJobposting() {
  try {
    const response = await fetch(`/api/jobpostings/${jobpostingId}`);
    const data = await response.json();
    console.log(data);

    const {
      title,
      career,
      salary,
      education,
      job,
      workArea,
      workType,
      dueDate,
      content,
    } = data;

    titleInfo.value = title;
    careerInfo.value = career;
    salaryInfo.value = salary;
    educationInfo.value = education;
    jobInfo.value = job;
    workareaInfo.value = workArea;
    worktypeInfo.value = workType;
    duedateInfo.value = new Date(dueDate);
    contentInfo.value = content;
  } catch (error) {
    console.log(error);
  }
}

getJobposting();

// 채용공고 수정하기
modifyBtn.addEventListener('click', async () => {
  const jobData = {
    title: titleInfo.value,
    career: careerInfo.value,
    salary: salaryInfo.value,
    education: educationInfo.value,
    job: jobInfo.value,
    workArea: workareaInfo.value,
    workType: worktypeInfo.value,
    dueDate: duedateInfo.value,
    content: contentInfo.value,
  };

  if (contentInfo.value.length < 10) {
    alert('내용을 10자 이상 입력해주세요.');
  }

  try {
    const response = await fetch(`/api/jobpostings/${jobpostingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });
    console.log('jobData', jobData);

    if (response.ok) {
      alert('채용 공고가 수정되었습니다.');
      // 회사 채용공고 영역으로 이동
      const applyCompanyUrl = `/apply/company`;
      window.location.href = applyCompanyUrl;
    } else {
      console.error('채용 공고를 생성하는 동안 오류가 발생했습니다.', response);
    }
  } catch (error) {
    console.error('요청을 보내는 중 오류가 발생했습니다:', error);
  }
});
