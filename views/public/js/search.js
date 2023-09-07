document.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault;
});
const searchBar = document.querySelector('.search-input');
const searchBtn = document.querySelector('#searchBtn');
searchBar.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});
searchBtn.addEventListener('click', async () => {
  console.log('hi');
  console.log(searchBar.value);

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
