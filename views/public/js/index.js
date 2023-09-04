// 파라미터값 가져오기
document.addEventListener('DOMContentLoaded', async () => {
  getResumes();
});

// 모든 유저정보 가져오기
const getResumes = async () => {
  const jobseekerList = document.getElementById('jobseeker-list');
  try {
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
  } catch (error) {
    console.error(error);
  }
};

const logout = document.getElementById('logout');
if (logout) {
  logout.addEventListener('click', async () => {
    deleteCookie();
  });
}

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

// 채용공고 영역
const jobpostingBox = document.querySelector('#jobposting-list');

function jobpostingAppendTemp(data) {
  const temp = data
    .map((jobposting) => {
      return `
        <div class="jobposting-card" id="jobposting-card" onclick="goToJobpostingSubpage(${jobposting.id})">
            <div>
              <div class="jobposting-title" id="jobposting-title">
              ${jobposting.title}
              </div>
              <div class="jobposting-job" id="jobposting-job">${jobposting.dueDate}</div>
              <p>${jobposting.workArea}</p>
            </div>
          </div>
      `;
    })
    .join('');

  jobpostingBox.insertAdjacentHTML('beforeend', temp);
}

async function getJobposting() {
  try {
    const jobpostingData = await fetch(`/api/jobpostings?page=1`);
    const jobpostingsData = await jobpostingData.json();
    jobpostingAppendTemp(jobpostingsData);
  } catch (error) {
    console.log(error);
  }
}

getJobposting();
const addJobpostingBtn = document.querySelector('#jobposting-add-btn');
addJobpostingBtn.addEventListener('click', async function () {
  const page = this.getAttribute('data-page');
  if (!page) {
    const res = await fetch(`/api/jobpostings?page=2`);
    const data = await res.json();
    jobpostingAppendTemp(data);
    this.setAttribute('data-page', 3);
  } else {
    const res = await fetch(`/api/jobpostings?page=${page}`);
    const data = await res.json();
    jobpostingAppendTemp(data);
    this.setAttribute('data-page', Number(page) + 1);
  }
});

function goToJobpostingSubpage(jobpostingId) {
  const subpageUrl = `/jobposting/${jobpostingId}`;
  window.location.href = subpageUrl;
}

// 회사 영역
const companiesBox = document.querySelector('#companies-list');
function companiesAppendTemp(data) {
  const temp = data
    .map((company) => {
      return `
              <div class="jobposting-card" id="companies-card" onclick="goToCompanySubpage(${company.id})">
              <img
                class="jobposting-img"
                id="companies-img"
                src="${company.image}"
                alt=""
                srcset=""
                onerror="this.src='/img/company.jpg';"
              />
              <div>
                <div class="jobposting-title" id="companies-title">
                ${company.title}
                </div>
                <div class="jobposting-job" id="companies-job">${company.business}</div>
                <p>${company.employees}</p>
              </div>
            </div>
          `;
    })
    .join('');
  companiesBox.insertAdjacentHTML('beforeend', temp);
}
async function getCompanies() {
  try {
    const companyData = await fetch(`/api/companies?page=1`);
    const companiesData = await companyData.json();
    companiesAppendTemp(companiesData);
  } catch (error) {
    console.error(error);
  }
}
getCompanies();
const addCompaniesBtn = document.querySelector('#companies-add-btn');
addCompaniesBtn.addEventListener('click', async function () {
  const page = this.getAttribute('data-page');
  if (!page) {
    const res = await fetch(`/api/companies?page=2`);
    const data = await res.json();
    companiesAppendTemp(data);
    this.setAttribute('data-page', 3);
  } else {
    const res = await fetch(`/api/companies?page=${page}`);
    const data = await res.json();
    companiesAppendTemp(data);
    this.setAttribute('data-page', Number(page) + 1);
  }
});

function goToCompanySubpage(companyId) {
  const subpageUrl = `/subpage/company/${companyId}`;
  window.location.href = subpageUrl;
}
