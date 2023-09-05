// 회사정보 선택하면 회사 정보 페이지로 이동하게
// 채용공고 지원을 get 해서 가져오기
// 마감일을 d-day 로 표시해주기
// 지원 취소 버튼누르면 alret, confirm! 하게해서 취소하게되면 회사 규정에 따라 재지원이 불가능할 수도 있습니다.  취소하시겠습니까?
// 지원하기 버튼 누르면 지원리스트로 이동하고 지원 내역 표시

// 1. 잡포스팅의 모든 데이터를 가져온다
// 2. 유저가 지원한 잡포스팅의 데이터만 가져온다
// - applicnat체크로
// - 유저 가드를 사용해서 유저를 가져옴
// - applicant 테이블에서 userid를 가져오고 잡포스팅아이디를 꺼내온다
//
// 3. 특정한 잡포스팅 데이터만 가져온다.

const type = window.location.pathname.split('/')[2];
const applyBox = document.querySelector('.apply-list');

async function getAppliesUser() {
  try {
    if (type === 'user') {
      const response = await fetch('/api/applications/user');
      const applyUserData = await response.json();

      const temp = applyUserData
        .map((applyUser) => {
          return `
                 <div class="apply-card">
                   <h4>${applyUser.title}</h4>
                   <h6>근무지 : ${applyUser.workArea}</h6>
                   <h6>마감일 : ${applyUser.dueDate}</h6>
                 </div>
                   <button
                   type="button"
                   class="btn btn-outline-primary apply-btn"
                   data-id=${applyUser.id}
                  >
                   지원 취소
                  </button>
                  <hr>
                 `;
        })
        .join('');
      applyBox.innerHTML = temp;

      const applyBtns = document.querySelectorAll('.apply-btn');
      applyBtns.forEach((applyBtn) => {
        applyBtn.addEventListener('click', async (event) => {
          const jobpostingId = event.target.getAttribute('data-id');
          console.log(jobpostingId);

          const result = confirm('확인 버튼을 누르면 지원이 취소됩니다.');
          if (result === true) {
            const response = await fetch(`/api/applications/${jobpostingId}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) window.location.reload();
            alert('지원이 취소되었습니다.');
          } else if (result === false) {
            alert('취소 되었습니다.');
          }
        });
      });
    } else if (type === 'company') {
      const response = await fetch('/api/jobpostings/company');
      const applyCompanyData = await response.json();
      const temp = applyCompanyData
        .map((applyCompany) => {
          return `
                 <div class="apply-card">
                   <h4>${applyCompany.title}</h4>
                   <h6>근무지 :${applyCompany.workArea}</h6>
                   <h6>마감일 :${applyCompany.dueDate}</h6>
                 </div>
                <button
                   type="button"
                   class="btn btn-outline-primary apply-btn"
                   onclick="goToUrl(${applyCompany.id})"
                 >
                   수정
                  </button>
                  <button
                  type="button"
                  class="btn btn-outline-danger delete-btn"
                  data-id=${applyCompany.id}
                >
                  삭제
                </button>
                  <hr>
               `;
        })
        .join('');
      applyBox.innerHTML = temp;

      // 수정 버튼
      const applyBtns = document.querySelectorAll('.apply-btn');
      applyBtns.forEach((applyBtn) => {
        applyBtn.addEventListener('click', () => {
          const subPageUrl = `/jobposting/company`; //링크 추후 수정 예정!
          window.location.href = subPageUrl;
        });
      });

      // 삭제 버튼
      const deleteBtns = document.querySelectorAll('.delete-btn');
      deleteBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener('click', async (event) => {
          const jobpostingId = event.target.getAttribute('data-id');

          const result = confirm('정말 삭제하시겠습니까?');
          if (result === true) {
            // 지원공고 삭제
            const response = await fetch(`/api/jobpostings/${jobpostingId}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) window.location.reload();
            alert('삭제되었습니다.');
          } else if (result === false) {
            alert('취소되었습니다.');
          }
        });
      });
    }
  } catch (error) {
    console.error(error);
  }
}

getAppliesUser();
