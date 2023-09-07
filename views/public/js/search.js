document.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault;
});

const searchBar = document.querySelector('.search-input');
const searchBtn = document.querySelector('#searchBtn');
const companiesBar = document.querySelector('#companies-list');

searchBar.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});
searchBtn.addEventListener('click', async () => {
  console.log(searchBar.value);

  const keyword = searchBar.value;

  //   // 회사 검색
  //   const searchCP = await fetch(`/api/companies/search`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ keyword }),
  //   });
  //   // 회사검색데이터 가공
  //   const resCP = await searchCP.json();
  //   console.log(resCP);

  //   companiesBar.innerHTML = '';
  //   resCP.forEach((CP) => {
  //     console.log(CP);
  //     companiesBar.innerHTML += `<div class="jobposting-card" id="companies-card">
  //                                     <img
  //                                     class="jobposting-img"
  //                                     id="companies-img"
  //                                     src="${CP.image}"
  //                                     alt=""
  //                                     srcset=""
  //                                     onerror="this.src='/img/company.jpg';"
  //                                     />
  //                                     <div>
  //                                     <div class="jobposting-title" id="companies-title">
  //                                         ${CP.title}
  //                                     </div>
  //                                     <div class="jobposting-job" id="companies-job">${CP.business}</div>
  //                                     <p>${CP.employees}</p>
  //                                     </div>
  //                                 </div>`;
  //   });

  // 채용공고 검색
  const searchJP = await fetch(`/api/jobpostings/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword }),
  });
  // 채용공고데이터 가공
  const resJP = await searchJP.json();
  console.log(resJP);
});
