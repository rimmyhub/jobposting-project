// 회사정보 선택하면 회사 정보 페이지로 이동하게
// 채용공고 지원을 get 해서 가져오기
// 마감일을 d-day 로 표시해주기
// 지원 취소 버튼누르면 alret, confirm! 하게해서 취소하게되면 회사 규정에 따라 재지원이 불가능할 수도 있습니다.  취소하시겠습니까?
// 지원하기 버튼 누르면 지원리스트로 이동하고 지원 내역 표시

// jobposting 값만 가져오는 함수
// async function fetchJobpostingId() {
//   const jobpostingIdResponse = await fetch(`api/applications/me`); // 내가 지원한 것만 보겠다.
//   const jobpostingId = await jobpostingIdResponse.json();
//   return jobpostingId;
// }

// const jobpostingId = await fetchJobpostingId();
// 1. 잡포스팅의 모든 데이터를 가져온다
// 2. 유저가 지원한 잡포스팅의 데이터만 가져온다
// - applicnat체크로
// - 유저 가드를 사용해서 유저를 가져옴
// - applicant 테이블에서 userid를 가져오고 잡포스팅아이디를 꺼내온다
//
// 3. 특정한 잡포스팅 데이터만 가져온다.

const type = window.location.pathname.split('/')[2];
const applyBox = document.querySelector('.apply-list');
const applyBtn = document.querySelector('#apply-btn');

async function getAppliesUser() {
  try {
    if (type === 'user') {
      const response = await fetch('/api/applications/user');
      console.log(response);
      const applyUserData = await response.json();

      const temp = applyUserData
        .map((applyUser) => {
          return `
                 <div class="apply-card">
                   <h4>${applyUser.title}</h4>
                   <h6>${applyUser.workArea}</h6>
                   <h6>${applyUser.dueDate}</h6>
                 </div>
                 `;
        })
        .join('');
      applyBox.innerHTML = temp;
    } else if (type === 'company') {
      const response = await fetch('/api/jobposting/company');
      console.log(response);
    }
  } catch (error) {
    console.error(error);
  }
}

getAppliesUser(); // 함수 호출

// 사용자 유형에 따라 버튼 동작 처리 (예: "지원 취소" 또는 "게시물 편집" 버튼 표시)
if (type === 'user') {
  // 사용자별 동작 처리 (예: "지원 취소" 버튼 표시)
} else if (type === 'company') {
  // 회사별 동작 처리 (예: "게시물 편집" 버튼 표시)
}
