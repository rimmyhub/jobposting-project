const type = window.location.pathname.split('/')[2];
const applyBox = document.querySelector('.apply-list');

async function getAppliesUser() {
  try {
    if (type === 'user') {
      const response = await fetch('/api/applications/user');
      const applyUserData = await response.json();
      console.log(applyUserData);
      const temp = applyUserData
        .map((applyUser) => {
          return `
                 <div class="apply-card">
                   <h4
                   class="jobposting-btn"
                   style="cursor: pointer;
                   text-decoration: underline;"
                   data-id=${applyUser.id}
                   >${applyUser.title}</h4>
                   <h6>근무지 : ${applyUser.workArea}</h6>
                   <h6>마감일 : ${applyUser.dueDate}</h6>
                 </div>

                <button
                   type="button"
                   class="btn btn-outline-danger apply-delete-btn"
                   data-id=${applyUser.id}
                  >
                   지원 취소
                </button>

                  <hr>
                 `;
        })
        .join('');
      applyBox.innerHTML = temp;

      // 채용공고 내용 보기
      const jobpostingBtns = document.querySelectorAll('.jobposting-btn');
      jobpostingBtns.forEach((jobpostingBtn) => {
        jobpostingBtn.addEventListener('click', async (event) => {
          const jobpostingId = event.target.getAttribute('data-id');
          console.log(jobpostingId);
          window.location.href = `/jobposting/${jobpostingId}`;
        });
      });

      // 지원 취소
      const applyDeleteBtns = document.querySelectorAll('.apply-delete-btn');
      applyDeleteBtns.forEach((applyDeleteBtn) => {
        applyDeleteBtn.addEventListener('click', async (event) => {
          const jobpostingId = event.target.getAttribute('data-id');
          // console.log(jobpostingId);

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
      // console.log(applyCompanyData);

      const temp = applyCompanyData
        .map((applyCompany) => {
          return `

                 <div class="apply-card">
                   <h4    
                   class="jobposting-company-btn"
                   onclick="goToUrl(${applyCompany.id})"
                   data-id=${applyCompany.id}
                   style="cursor: pointer;
                   text-decoration: underline"           
                   >${applyCompany.title}</h4>
                   <h6>${applyCompany.job}</h6>
                   <h6>${applyCompany.dueDate}</h6>
                 </div>
                 <button
                 type="button"
                 class="btn btn-outline-danger delete-btn"
                 data-id=${applyCompany.id}
               >
                 삭제
               </button>
               <button
               type="button"
               class="btn btn-outline-primary"
               id="jobposting-modify-btn"
               data-id=${applyCompany.id}
             >
               수정
             </button>
                  <hr>
               `;
        })
        .join('');
      applyBox.innerHTML = temp;

      // 삭제된 채용공고 불러오기
      const deleteResponse = await fetch('/api/jobpostings/company/delete');
      const deleteData = await deleteResponse.json();
      console.log(deleteData);
      const deletedDataBox = document.getElementById('deleted-data-box');
      console.log(deletedDataBox);
      const deletedDataHtml = deleteData
        .map((deletedItem) => {
          return `
            <div class="deleted-item">
              <h4>${deletedItem.title}</h4>
              <h6>${deletedItem.job}</h6>
              <h6>${deletedItem.dueDate}</h6>
            </div>
            <hr/>
          `;
        })
        .join('');

      deletedDataBox.innerHTML = deletedDataHtml;

      // 채용공고 보기 버튼
      const applyBtns = document.querySelectorAll('.jobposting-company-btn');
      applyBtns.forEach((applyBtn) => {
        applyBtn.addEventListener('click', (event) => {
          const jobpostingId = event.target.getAttribute('data-id');
          const subPageUrl = `/jobposting/${jobpostingId}`; //링크 추후 수정 예정!
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

      // 채용 공고 추가 버튼
      const jobpostingAddBtn = document.getElementById('jobposting-add-btn');
      jobpostingAddBtn.addEventListener('click', () => {
        const jobpostingAddUrl = `/jobposting/add`;
        window.location.href = jobpostingAddUrl;
      });

      // 채용공고 수정 버튼
      const modifyBtn = document.getElementById('jobposting-modify-btn');
      modifyBtn.addEventListener('click', (event) => {
        const jobpostingId = event.target.getAttribute('data-id');
        const jobpostingModifyUrl = `/jobposting/edit/${jobpostingId}`;
        console.log(jobpostingModifyUrl);
        window.location.href = jobpostingModifyUrl;
      });
    }
  } catch (error) {
    console.error(error);
  }
}

getAppliesUser();
