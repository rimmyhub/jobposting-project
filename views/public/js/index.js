// 파라미터값 가져오기
document.addEventListener('DOMContentLoaded', async () => {
  getResumes();
  getCompanies();
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

// 회사 정보 가져오기
async function getCompanies() {
  try {
    const companiesBox = document.querySelector('.jobposting-list');

    // 회사 정보 가져오기
    const companyData = await fetch(`/api/companies`);
    const companiesData = await companyData.json();

    companiesBox.innerHTML = '';

    // 각 회사와 채용 정보 항목을 처리
    companiesData.forEach((company) => {
      const jobpostingCard = document.createElement('div');
      jobpostingCard.innerHTML = `<div class="jobposting-card">
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
      companiesBox.append(jobpostingCard);
    });
  } catch (error) {
    console.error(error);
  }
}
