document.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault;
  searchInit();
  selectInit();
});

// 검색바 설정 태그들
const searchBar = document.querySelector('.search-input');
const searchBtn = document.querySelector('#searchBtn');
const companiesBar = document.querySelector('#companies-list');
const jobPostingsBar = document.querySelector('#jobposting-list');

// 조건검색 설정 태그들
const regionSelect = document.getElementById('regionSelect');
const experienceSelect = document.getElementById('experienceSelect');

// 검색함수 모음
function searchInit() {
  enter();
  searchCompany();
  searchJobposting();
}
// 엔터이벤트리스너
function enter() {
  searchBar.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });
}
// 회사검색
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
// 채용공고검색
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

// 조건검색 함수모음
function selectInit() {
  searchRegion();
  searchExperience();
}
// 지역별 검색
function searchRegion() {
  regionSelect.addEventListener('change', async () => {
    const workArea = regionSelect.value;
    const searchRegion = await fetch(`/api/jobpostings/workArea`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workArea }),
    });

    const resRegion = await searchRegion.json();

    jobPostingsBar.innerHTML = '';
    resRegion.forEach((JP) => {
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
// 모집경력별 검색
function searchExperience() {
  console.log('hi');
  experienceSelect.addEventListener('change', async () => {
    const career = experienceSelect.value;
    console.log(career);

    const selectExperience = await fetch(`/api/jobpostings/career`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ career }),
    });

    const resExp = await selectExperience.json();
    console.log(resExp);

    jobPostingsBar.innerHTML = '';
    resExp.forEach((JP) => {
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
