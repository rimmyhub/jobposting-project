const updateBtn = document.querySelector('#jobposting-update-btn');
const titleInfo = document.querySelector('#add-title-info');
const careerInfo = document.querySelector('#add-career-info');
const salaryInfo = document.querySelector('#add-salary-info');
const educationInfo = document.querySelector('#add-education-info');
const jobInfo = document.querySelector('#add-job-info');
const workareaInfo = document.querySelector('#add-workarea-info');
const worktypeInfo = document.querySelector('#add-worktype-info');
const duedateInfo = document.querySelector('#add-duedate-info');
const contentInfo = document.querySelector('#add-content-info');

updateBtn.addEventListener('click', async () => {
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
    const response = await fetch('/api/jobpostings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });
    console.log('jobData', jobData);

    if (response.ok) {
      alert('채용 공고가 추가되었습니다.');

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
