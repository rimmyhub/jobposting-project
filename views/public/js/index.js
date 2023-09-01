// 파라미터값 가져오기
document.addEventListener('DOMContentLoaded', async () => {
  getResumes();

  getJobposting();
});

// 모든 유저정보 가져오기
const getResumes = async () => {
  const jobseekerList = document.getElementById('jobseeker-list');

  const datas = await fetch('/api/resumes')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });

  datas.forEach((el) => {
    const column = document.createElement('div');
    column.innerHTML = `<div id="${el.id}" OnClick="location.href='/subpage/${el.user.id}/${el.id}?id=${el.user.id}&resumeId=${el.id}'" class="jobseeker-card">
                          <img
                            class="jobseeker-img"
                            src="/img/userImg.jpg"
                            alt=""
                            srcset=""
                          />
                          <div class="jobseeker-info">
                            <div class="jobseeker-name">${el.user.name}</div>
                            <div class="jobseeker-job">${el.content}</div>
                          </div>
                        </div>`;
    jobseekerList.append(column);
  });
};

const logout = document.getElementById('logout');

logout.addEventListener('click', async () => {
  deleteCookie();
});

async function deleteCookie() {
  let isSuccess;
  await fetch('/api/auth/logout', {
    method: 'DELETE',
  })
    .then((el) => {
      isSuccess = el.ok;
    })
    .catch((e) => {
      console.log(e);
    });
  if (isSuccess) {
    alert('로그아웃 되었습니다.');
    location.href = '/';
  }
}

async function getJobposting() {
  const jobpostingBox = document.querySelector('.jobposting-list');
  const params = new URLSearchParams(window.location.search);
  const companyId = params.get('companyId');

  // 채용공고 데이터 가져오기
  // const jobData = await fetch(`/api/jobpostings/${companyId}`);
  // const jobsData = await jobData.json();

  // 회사 정보 가져오기
  const companyData = await fetch(`/api/companys`);
  const companiesData = await companyData.json();

  jobpostingBox.innerHTML = '';

  // 각 회사와 채용 정보 항목을 처리
  companiesData.forEach((company) => {
    const jobpostingCard = document.createElement('div');
    jobpostingCard.classList.add('jobposting-card');
    jobpostingCard.innerHTML = `
      <img
        class="jobposting-img"
        src="${company.image}"
        alt=""
        srcset=""
        onerror="this.src='/img/company.jpg';"
      />
      <div>
        <div class="jobposting-title">${company.title}</div>
        <div class="jobposting-job">${company.business}</div>
        <p>${company.employees}</p>
      </div>`;
    jobpostingBox.appendChild(jobpostingCard);
  });
}
