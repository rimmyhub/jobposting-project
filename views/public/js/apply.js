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
                 <button type="button"
                 class="btn btn-outline-primary jobposting-btn"
                 style="margin-right: 10px"
                  >
                   지원한 채용 공고 보기
                 </button>
                 
                <button
                   type="button"
                   class="btn btn-outline-danger apply-btn"
                   data-id=${applyUser.id}
                  >
                   지원 취소
                </button>

                  <hr>
                 `;
        })
        .join('');
      applyBox.innerHTML = temp;

      const jobpostingBtns = document.querySelectorAll('.jobposting-btn');
      jobpostingBtns.forEach((jobpostingBtn) => {
        jobpostingBtn.addEventListener('click', async (event) => {
          const jobpostingId = event.target.getAttribute('data-id');
          window.location.href = `/jobposting/${jobpostingId}`;
        });
      });

      const applyBtns = document.querySelectorAll('.apply-btn');
      applyBtns.forEach((applyBtn) => {
        applyBtn.addEventListener('click', async (event) => {
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
                   <h4>${applyCompany.title}</h4>
                   <h6>근무지 :${applyCompany.workArea}</h6>
                   <h6>마감일 :${applyCompany.dueDate}</h6>
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
               data-bs-toggle="modal"
               data-bs-target="#jobposting"
             >
               수정
             </button>
 


             <div
             class="modal fade modal-fullscreen-sm-down"
             id="jobposting"
             data-bs-backdrop="static"
             data-bs-keyboard="false"
             tabindex="-1"
             aria-labelledby="staticBackdropLabel"
             aria-hidden="true"
           >
             <div class="modal-dialog modal-fullscreen">
               <div class="modal-content">
                 <div class="modal-header">
                   <h1 class="modal-title fs-5" id="staticBackdropLabel">채용공고 수정</h1>
                   <button
                     type="button"
                     class="btn-close"
                     data-bs-dismiss="modal"
                     aria-label="Close"
                   ></button>
                 </div>
                 <div class="modal-body text-start">
                   <div class="modal-body">
                     <!-- 채용공고명 -->
                     <div class="container">
                       <div class="mb-2 row">
                         <label class="col-sm-3 col-form-label">채용공고명</label>
                         <div class="col-12">
                           <input
                             class="form-control"
                             id="modify-title-info"
                             placeholder="공고명을 입력해주세요."
                           />
                         </div>
                       </div>
                       <!-- 채용공고명 -->
                       <!-- 경력 -->
                       <div class="mb-2 row">
                         <label class="col-sm-3 col-form-label">경력</label>
                         <div class="col-12">
                           <input
                             class="form-control"
                             id="modify-career-info"
                             placeholder="예) 신입/경력"
                           />
                         </div>
                       </div>
                       <!-- 경력 -->
                       <!-- 급여 -->
                       <div class="mb-2 row">
                         <label class="col-sm-3 col-form-label">급여</label>
                         <div class="col-12">
                           <input
                             class="form-control"
                             id="modify-salary-info"
                             placeholder="예) 회사 내규"
                           />
                         </div>
                       </div>
                       <!-- 급여 -->
                       <!-- 학력 -->
                       <div class="mb-2 row">
                         <label class="col-sm-3 col-form-label">학력</label>
                         <div class="col-12">
                           <input
                             class="form-control"
                             id="modify-education-info"
                             placeholder="예) 학력 무관"
                           />
                         </div>
                       </div>
                       <!-- 학력 -->
                       <!-- 직무 -->
                       <div class="mb-2 row">
                         <label class="col-sm-3 col-form-label">직무</label>
                         <div class="col-12">
                           <input
                             class="form-control"
                             id="modify-job-info"
                             placeholder="예) IT"
                           />
                         </div>
                       </div>
                       <!-- 직무 -->
                       <!-- 근무지역 -->
                       <div class="mb-2 row">
                         <label class="col-sm-3 col-form-label">근무지역</label>
                         <div class="col-12">
                           <input
                             class="form-control"
                             id="modify-workarea-info"
                             placeholder="예) 서울 > 중구"
                           />
                         </div>
                       </div>
                       <!-- 근무지역 -->
                       <!-- 근무형태 -->
                       <div class="mb-2 row">
                         <label class="col-sm-3 col-form-label">근무형태</label>
                         <div class="col-12">
                           <input
                             class="form-control"
                             id="modify-worktype-info"
                             placeholder="예) 계약직/정규직 [수습기간: 3개월]"
                           />
                         </div>
                       </div>
                       <!-- 근무형태 -->
                       <!-- 채용 마감일 -->
                       <div class="mb-2 row">
                         <label class="col-sm-3 col-form-label">채용 마감일</label>
                         <div class="col-12">
                           <input
                             class="form-control"
                             id="modify-duedate-info"
                             placeholder="예) 상시"
                           />
                         </div>
                       </div>
                       <!-- 채용마감일 -->
                       <!-- 내용 -->
                       <div class="mb-3">
                         <label
                           for="exampleFormControlTextarea1"
                           class="form-label"
                           style="margin-top: 10px"
                           >채용공고 설명</label
                         >
                         <textarea
                           class="form-control"
                           id="modify-content-info"
                           rows="15"
                           placeholder="채용공고 내용을 10자 이상 입력해주세요."
                         ></textarea>
                       </div>
           
                       <!-- 내용 -->
                     </div>
                   </div>
                 </div>
                 <div class="modal-footer">
                   <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                     취소
                   </button>
                   <button
                     type="button"
                     class="btn btn-primary"
                     id="jobposting-modify-update-btn"
                     data-id=${applyCompany.id}
                   >
                     저장
                   </button>
                 </div>
               </div>
             </div>
           </div>
           





               <button
                   type="button"
                   class="btn btn-outline-primary jobposting-btn"
                   onclick="goToUrl(${applyCompany.id})"
                 >
                   채용공고 보기
                  </button>
                  <hr>
               `;
        })
        .join('');
      applyBox.innerHTML = temp;

      // 채용공고 보기 버튼
      const applyBtns = document.querySelectorAll('.jobposting-btn');
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

      // 채용공고 수정

      const modifyBtn = document.querySelector('#jobposting-modify-update-btn');
      const titleInfo = document.querySelector('#modify-title-info');
      const careerInfo = document.querySelector('#modify-career-info');
      const salaryInfo = document.querySelector('#modify-salary-info');
      const educationInfo = document.querySelector('#modify-education-info');
      const jobInfo = document.querySelector('#modify-job-info');
      const workareaInfo = document.querySelector('#modify-workarea-info');
      const worktypeInfo = document.querySelector('#modify-worktype-info');
      const duedateInfo = document.querySelector('#modify-duedate-info');
      const contentInfo = document.querySelector('#modify-content-info');

      // 내용 불러오기 // 내일할래
      const getJobpostingData = async (event) => {
        const jobpostingId = event.target.getAttribute('data-id');
        console.log(jobpostingId);

        const response = await fetch(`api/jobpostings/company/${jobpostingId}`);
        const data = await response.json();
        console.log(data);
        const {
          title,
          career,
          salary,
          education,
          job,
          workArea,
          workType,
          dueDate,
          content,
        } = findJobposting;
      };
      getJobpostingData();

      // 수정
      modifyBtn.addEventListener('click', async (event) => {
        const jobpostingId = event.target.getAttribute('data-id');

        const jobData = {
          title: titleInfo.value,
          career: careerInfo.value,
          salary: salaryInfo.value,
          education: educationInfo.value,
          job: jobInfo.value,
          workArea: workareaInfo.value,
          workType: worktypeInfo.value,
          dueDate: duedateInfo.value,
          content: contentInfo.value,
        };

        if (contentInfo.value.length < 10) {
          alert('내용을 10자 이상 입력해주세요.');
        }

        try {
          const response = await fetch(`/api/jobpostings/${jobpostingId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(jobData),
          });
          console.log('jobData', jobData);

          if (response.ok) {
            alert('채용 공고가 추가되었습니다.');
            window.location.reload();
          } else {
            console.error(
              '채용 공고를 생성하는 동안 오류가 발생했습니다.',
              response,
            );
          }
        } catch (error) {
          console.error('요청을 보내는 중 오류가 발생했습니다:', error);
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}

getAppliesUser();
