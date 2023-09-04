// 회사정보 선택하면 회사 정보 페이지로 이동하게
// 채용공고 지원을 get 해서 가져오기
// 마감일을 d-day 로 표시해주기
// 지원 취소 버튼누르면 alret, confirm! 하게해서 취소하게되면 회사 규정에 따라 재지원이 불가능할 수도 있습니다.  취소하시겠습니까?
// 지원하기 버튼 누르면 지원리스트로 이동하고 지원 내역 표시

//참고 예시
// // 채용공고 영역
// const jobpostingBox = document.querySelector('.jobposting-list');

// async function getJobpostings() {
//   try {
//     // 채용공고 데이터 가져오기
//     const response = await fetch(`/api/jobpostings`);
//     const jobpostingsData = await response.json();

//     // 데이터를 사용하여 HTML 생성 및 추가
//     const temp = jobpostingsData.map((jobposting) => {
//       return `
//         <div class="jobposting-card">
//           <div>
//             <div class="jobposting-title">${jobposting.title}</div>
//             <div class="jobposting-job">${jobposting.dueDate}</div>
//             <p>${jobposting.workArea}</p>
//           </div>
//         </div>
//       `;
//     }).join('');

//     jobpostingBox.innerHTML = temp;
//   } catch (error) {
//     console.error(error);
//   }
// }

// // getJobpostings 함수를 호출하여 채용공고 데이터를 가져오고 HTML에 추가합니다.
// getJobpostings();

jobpostingId = document.location.pathname.split('/')[2];

console.log(jobpostingId);

const endpoint = isUser
  ? '/api/user/apply'
  : isCompany
  ? '/api/companies/apply'
  : '';

console.log(endpoint);

if (isUser) {
  const applyBox = document.querySelector('.apply-list');
  const applyBtn = document.querySelector('#apply-btn');

  console.log(applyBox);

  async function getAppliesUser() {
    try {
      const response = await fetch(`api/applications/user/${jobpostingId}`);
      const applyUserData = await response.json();
      const temp = applyUserData.map((applyUser) => {
        return `
            <div class="apply-card">
            <h4>cloud support associate</h4>
            <h6>항공우주/기계,전기전자,생산기술</h6>
            <h6>마감일 : 2023-01-03</h6>
            
            
            
            `;
      });
    } catch (error) {
      console.error('error');
    }
  }
}
