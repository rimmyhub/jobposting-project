document.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault;
  selectInit();
});

// 검색바 설정 태그들
const searchBar = document.querySelector('.search-input'); // 검색 바
const searchBtn = document.querySelector('#searchBtn'); // 검색버튼 (돋보기)

// 조건검색 설정 태그들
const regionSelect = document.getElementById('regionSelect'); // 지역 옵션
const experienceSelect = document.getElementById('experienceSelect'); // 경력 옵션
const occupationSelect = document.getElementById('occupationSelect'); // 직군 옵션
const subOptionsDiv = document.getElementById('subOptions'); // 직군 세부옵션

// innerHTML 태그들
const jobPostingsBar = document.querySelector('#jobposting-list'); // 채용공고 태그
const companiesBar = document.querySelector('#companies-list'); // 회사 태그

// openSearch 검색결과
async function searchCompany() {
  // 검색어
  const keyword = searchBar.value;
  // 키워드 검색
  const searchData = await fetch(`/api/search/data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword }),
  });
  // 회사검색데이터 가공
  const data = await searchData.json();

  if (data.message) {
    return (
      (companiesBar.innerHTML = `<ul>"${keyword}"에 해당하는 검색결과가 존재하지 않습니다.</ul>`),
      (jobPostingsBar.innerHTML = `<ul>"${keyword}"에 해당하는 검색결과가 존재하지 않습니다.</ul>`)
    );
  }

  companiesBar.innerHTML = '';
  jobPostingsBar.innerHTML = '';

  // 데이터 순환
  for (i = 0; i < data.length; i++) {
    // 회사 데이터 화면
    if (data[i]._source.address) {
      companiesBar.innerHTML += `
                                  <div
                                  class="card jobposting-card"
                                  id="companies-card"
                                  onclick="goToCompanySubpage('${data[i]._source.id}')"
                                  style="width: 20rem; cursor: pointer;"
                                >
                                  <img
                                    class="jobposting-img"
                                    id="companies-img"
                                    src="${data[i]._source.image}"
                                    alt=""
                                    srcset=""
                                    onerror="this.src='/img/company.jpg';"
                                  />
                                  <div class="card-body">
                                    <h4 class="jobposting-title" id="companies-title">
                                      ${data[i]._source.title}
                                    </h4>
                                    <div class="jobposting-job text-body-secondary mb-2" id="companies-job">
                                      ${data[i]._source.business}
                                    </div>
                                    <p>${data[i]._source.employees}</p>
                                  </div>
                                </div>
                                  `;
    }
    // 채용공고 데이터 화면
    if (!data[i]._source.address) {
      jobPostingsBar.innerHTML += `
                                  <div
                                  class="card jobposting-card"
                                  id="jobposting-card"
                                  onclick="goToJobpostingSubpage(${data[i]._source.id})"
                                  style="width: 20rem; cursor: pointer;"
                                  >
                                    <div class="card-body">
                                      <h4 class="jobposting-title" id="jobposting-title">
                                        ${data[i]._source.title}
                                      </h4>
                                      <h6
                                        class="card-subtitle mb-2 text-body-secondary jobposting-job"
                                        id="jobposting-job"
                                      >
                                        마감일 : ${data[i]._source.dueDate}
                                      </h6>
                                      <p class="card-text">${data[i]._source.workArea}</p>
                                    </div>
                                  </div>
                                  `;
    }
  }
}

// 채용공고검색
// function searchJobposting() {
//   // 이벤트 리스너
//   searchBtn.addEventListener('click', async () => {
//     // 검색어
//     const keyword = searchBar.value;

//     // 채용공고 검색
//     const searchJP = await fetch(`/api/search`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ keyword }),
//     });
//     // 채용공고데이터 가공
//     const resJP = await searchJP.json();
//     console.log(resJP);
//     return;

//     if (resJP.message) {
//       return (jobPostingsBar.innerHTML = `<ul>"${keyword}"에 해당하는 ${resJP.message}</ul>`);
//     }
//     jobPostingsBar.innerHTML = '';
//     resJP.forEach((JP) => {
//       jobPostingsBar.innerHTML += `
//                                     <div
//                                     class="card jobposting-card"
//                                     id="jobposting-card"
//                                     onclick="goToJobpostingSubpage(${JP.id})"
//                                     style="width: 20rem; cursor: pointer;"
//                                     >
//                                       <div class="card-body">
//                                         <h4 class="jobposting-title" id="jobposting-title">
//                                           ${JP.title}
//                                         </h4>
//                                         <h6
//                                           class="card-subtitle mb-2 text-body-secondary jobposting-job"
//                                           id="jobposting-job"
//                                         >
//                                           마감일 : ${JP.dueDate}
//                                         </h6>
//                                         <p class="card-text">${JP.workArea}</p>
//                                       </div>
//                                     </div>
//                                     `;
//     });
//   });
// }

// 조건검색 함수모음
function selectInit() {
  // searchRegion();
  // searchExperience();
  // jobOptionSelect();
  // selectJobposting();
  // selectCompany();
  searchOptionJP();
  searchOptionCP();
}

// 옵션에 따른 채용공고 검색
function searchOptionJP() {
  // 직군
  occupationSelect.addEventListener('change', async () => {
    // 바디값
    const occupation = occupationSelect.value; // 직군
    const workArea = regionSelect.value; // 지역
    const experience = experienceSelect.value; // 경력

    // 데이터 전송
    const searchJobposting = await fetch(`/api/jobpostings/option`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ occupation, workArea, experience }),
    });
    const resJP = await searchJobposting.json();
    if (resJP.message) {
      return (jobPostingsBar.innerHTML = `<ul>${resJP.message}</ul>`);
    }
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
  // 지역
  regionSelect.addEventListener('change', async () => {
    // 바디값
    const occupation = occupationSelect.value; // 직군
    const workArea = regionSelect.value; // 지역
    const experience = experienceSelect.value; // 경력

    // 데이터 전송
    const searchJobposting = await fetch(`/api/jobpostings/option`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ occupation, workArea, experience }),
    });
    const resJP = await searchJobposting.json();
    if (resJP.message) {
      return (jobPostingsBar.innerHTML = `<ul>${resJP.message}</ul>`);
    }
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
  // 경력
  experienceSelect.addEventListener('change', async () => {
    // 바디값
    const occupation = occupationSelect.value; // 직군
    const workArea = regionSelect.value; // 지역
    const experience = experienceSelect.value; // 경력

    // 데이터 전송
    const searchJobposting = await fetch(`/api/jobpostings/option`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ occupation, workArea, experience }),
    });
    const resJP = await searchJobposting.json();
    if (resJP.message) {
      return (jobPostingsBar.innerHTML = `<ul>${resJP.message}</ul>`);
    }
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

// 옵션에 따른 회사 검색
function searchOptionCP() {
  // 직군
  occupationSelect.addEventListener('change', async () => {
    // 바디값
    const occupation = occupationSelect.value; // 직군
    const workArea = regionSelect.value; // 지역

    // 데이터 전송
    const searchCompany = await fetch(`/api/companies/option`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ occupation, workArea }),
    });
    const resCP = await searchCompany.json();
    if (resCP.message) {
      return (companiesBar.innerHTML = `<ul>${resCP.message}</ul>`);
    }
    companiesBar.innerHTML = '';
    resCP.forEach((CP) => {
      companiesBar.innerHTML += `<div class="jobposting-card" id="companies-card" onclick="goToCompanySubpage('${CP.id}')">
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
  // 지역
  regionSelect.addEventListener('change', async () => {
    // 바디값
    const occupation = occupationSelect.value; // 직군
    const workArea = regionSelect.value; // 지역

    // 데이터 전송
    const searchCompany = await fetch(`/api/companies/option`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ occupation, workArea }),
    });
    const resCP = await searchCompany.json();
    if (resCP.message) {
      return (companiesBar.innerHTML = `<ul>${resCP.message}</ul>`);
    }
    companiesBar.innerHTML = '';
    resCP.forEach((CP) => {
      companiesBar.innerHTML += `<div class="jobposting-card" id="companies-card" onclick="goToCompanySubpage('${CP.id}')">
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

// 직군별 회사 + 채용공고 검색
function jobOptionSelect() {
  // 메인 선택 상자의 값이 변경될 때 호출되는 이벤트 핸들러
  occupationSelect.addEventListener('change', async () => {
    // 선택 직군 값
    const selectedOption = occupationSelect.value;

    // 직군별 채용공고 검색
    const searchJobposting = await fetch(`/api/jobpostings/job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job: selectedOption }),
    });
    const resJP = await searchJobposting.json();
    if (resJP.message) {
      return (jobPostingsBar.innerHTML = `"${selectedOption}"에 해당하는 ${resJP.message}`);
    }
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

    // 직군별 회사 검색
    const searchCompany = await fetch(`/api/companies/business`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business: selectedOption }),
    });
    const resCP = await searchCompany.json();
    if (resCP.message) {
      return (companiesBar.innerHTML = `<ul>"${selectedOption}"에 해당하는 ${resCP.message}</ul>`);
    }

    companiesBar.innerHTML = '';
    resCP.forEach((CP) => {
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

// (모집+지역)별 채용공고 검색
function selectJobposting() {
  regionSelect.addEventListener('change', async () => {
    const career = experienceSelect.value;
    const workArea = regionSelect.value;

    const searchRegion = await fetch(`/api/jobpostings/selectJobposting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workArea, career }),
    });

    const resRegion = await searchRegion.json();
    if (resRegion.message) {
      return (jobPostingsBar.innerHTML = `<ul>"${workArea}"${resRegion.message}</ul>`);
    }

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
  experienceSelect.addEventListener('change', async () => {
    const career = experienceSelect.value;
    const workArea = regionSelect.value;

    const selectExperience = await fetch(`/api/jobpostings/selectJobposting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workArea, career }),
    });

    const resExp = await selectExperience.json();
    if (resExp.message) {
      return (jobPostingsBar.innerHTML = `<ul>"${workArea}"${resExp.message}</ul>`);
    }

    jobPostingsBar.innerHTML = '';
    resExp.forEach((EP) => {
      jobPostingsBar.innerHTML += `<div class="jobposting-card" id="jobposting-card" onclick="goToJobpostingSubpage(${EP.id})">
                                    <div>
                                        <div class="jobposting-title" id="jobposting-title">
                                        ${EP.title}
                                        </div>
                                        <div class="jobposting-job" id="jobposting-job">${EP.dueDate}</div>
                                        <p>${EP.workArea}</p>
                                    </div>
                                    </div>`;
    });
  });
}

// 지역별 회사 검색
function selectCompany() {
  regionSelect.addEventListener('change', async () => {
    const address = regionSelect.value;

    const searchRegion = await fetch(`/api/companies/selectCompany`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });

    const resRegion = await searchRegion.json();
    if (resRegion.message) {
      return (companiesBar.innerHTML = `<ul>"${address}" ${resRegion.message}</ul>`);
    }

    companiesBar.innerHTML = '';
    resRegion.forEach((CP) => {
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

// // 지역별 검색
// function searchRegion() {
//   regionSelect.addEventListener('change', async () => {
//     const workArea = regionSelect.value;
//     const searchRegion = await fetch(`/api/jobpostings/workArea`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ workArea }),
//     });

//     const resRegion = await searchRegion.json();

//     jobPostingsBar.innerHTML = '';
//     resRegion.forEach((JP) => {
//       jobPostingsBar.innerHTML += `<div class="jobposting-card" id="jobposting-card" onclick="goToJobpostingSubpage(${JP.id})">
//                                     <div>
//                                         <div class="jobposting-title" id="jobposting-title">
//                                         ${JP.title}
//                                         </div>
//                                         <div class="jobposting-job" id="jobposting-job">${JP.dueDate}</div>
//                                         <p>${JP.workArea}</p>
//                                     </div>
//                                     </div>`;
//     });
//   });
// }
// // 모집경력별 검색
// function searchExperience() {
//   experienceSelect.addEventListener('change', async () => {
//     const career = experienceSelect.value;

//     const selectExperience = await fetch(`/api/jobpostings/career`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ career }),
//     });

//     const resExp = await selectExperience.json();

//     jobPostingsBar.innerHTML = '';
//     resExp.forEach((JP) => {
//       jobPostingsBar.innerHTML += `<div class="jobposting-card" id="jobposting-card" onclick="goToJobpostingSubpage(${JP.id})">
//                                     <div>
//                                         <div class="jobposting-title" id="jobposting-title">
//                                         ${JP.title}
//                                         </div>
//                                         <div class="jobposting-job" id="jobposting-job">${JP.dueDate}</div>
//                                         <p>${JP.workArea}</p>
//                                     </div>
//                                     </div>`;
//     });
//   });
// }

// 세부옵션
// // 세부 옵션을 초기화
// subOptionsDiv.innerHTML = '';

// // 선택한 직군에 따라 세부 옵션 추가
// switch (selectedOption) {
//   case '사무':
//     subOptionsDiv.innerHTML = `
//                               <div class="form-check">
//                                 <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
//                                 <label class="form-check-label" for="defaultCheck1">
//                                   Default checkbox
//                                 </label>
//                               </div>
//                               <div class="form-check">
//                                 <input class="form-check-input" type="checkbox" value="" id="defaultCheck2">
//                                 <label class="form-check-label" for="defaultCheck2">
//                                   Disabled checkbox
//                                 </label>
//                               </div>
//                               `;
//     break;
//   case '영업':
//     subOptionsDiv.innerHTML = `
//                               <div class="form-check">
//                                 <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
//                                 <label class="form-check-label" for="defaultCheck1">
//                                   Default checkbox
//                                 </label>
//                               </div>
//                               <div class="form-check">
//                                 <input class="form-check-input" type="checkbox" value="" id="defaultCheck2">
//                                 <label class="form-check-label" for="defaultCheck2">
//                                   Disabled checkbox
//                                 </label>
//                               </div>
//                               `;
//     break;
//   // 다른 직군에 대한 경우 추가
//   default:
//     subOptionsDiv.style.display = 'none';
//     break;
// }

// const a = document.getElementById('defaultCheck1');
// console.log(a.checked);

// // 세부 옵션을 표시
// if (selectedOption !== '직군') {
//   subOptionsDiv.style.display = 'block';
// } else {
//   subOptionsDiv.style.display = 'none';
// }
