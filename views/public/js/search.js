document.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault;
  enter();
  searchCompany();
  searchJobposting();
});

const searchBar = document.querySelector('.search-input');
const searchBtn = document.querySelector('#searchBtn');
const companiesBar = document.querySelector('#companies-list');
const jobPostingsBar = document.querySelector('#jobposting-list');

function enter() {
  searchBar.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });
}

function searchCompany() {
  // 이벤트 리스너
  searchBtn.addEventListener('click', async () => {
    console.log(searchBar.value);
    // 검색어
    const keyword = searchBar.value;

    // 회사 검색
    const searchCP = await fetch(`/api/companies/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword }),
    });
    // 회사검색데이터 가공
    const resCP = await searchCP.json();
    console.log(resCP);

    companiesBar.innerHTML = '';
    resCP.forEach((CP) => {
      console.log(CP);
      companiesBar.innerHTML += `<div class="jobposting-card" id="companies-card" onclick="goToCompanySubpage(${CP.id})">
                                <img
                                    class="jobposting-img"
                                    id="companies-img"
                                    src="${CP.image}"
                                    alt=""
                                    srcset=""
                                    onerror="this.src='/img/company.jpg';"
                                />
                                <div>
                                    <div class="jobposting-title" id="companies-title">
                                    ${CP.title}
                                    </div>
                                    <div class="jobposting-job" id="companies-job">${CP.business}</div>
                                    <p>${CP.employees}</p>
                                </div>
                                </div>`;
    });
  });
}

function searchJobposting() {
  // 이벤트 리스너
  searchBtn.addEventListener('click', async () => {
    // 검색어
    const keyword = searchBar.value;

    // 채용공고 검색
    const searchJP = await fetch(`/api/jobpostings/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword }),
    });
    // 채용공고데이터 가공
    const resJP = await searchJP.json();
    jobPostingsBar.innerHTML = '';
    resJP.forEach((JP) => {
      jobPostingsBar.innerHTML += `<div class="jobposting-card" id="jobposting-card" onclick="goToJobpostingSubpage(${JP.id})">
                                    <div>
                                        <div class="jobposting-title" id="jobposting-title">
                                        ${JP.title}
                                        </div>
                                        <div class="jobposting-job" id="jobposting-job">${JP.dueDate}</div>
                                        <p>${JP.workArea}</p>
                                    </div>
                                    </div>`;
    });
  });
}
