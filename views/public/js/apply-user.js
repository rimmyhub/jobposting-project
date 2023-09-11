// 유저정보 불러오기
// const userImage = document.getElementById('image'); // 유저 이미지
// const userName = document.getElementById('user-name'); // 유저 이름
// const userPhone = document.getElementById('user-phone'); // 유저 전화번호
// const userEmail = document.getElementById('user-email'); // 유저 이메일

// async function getApplyUser() {
//   try {
//     const response = await fetch(`/api/applications/applyuser/${jobpostingId}`);
//     const data = await response.json();
//     console.log(data);

//     const { image, name, phone, email } = data;

//     userImage.src = image;
//     userName.textContent = name;
//     userPhone.textContent = phone;
//     userEmail.textContent = email;
//   } catch (error) {
//     console.error(error);
//   }
// }
// getApplyUser();

const jobpostingId = window.location.pathname.split('/')[2];

// // 유저의 이력서ID 값만 가져오는 함수
// async function getResumeId() {
//   const userId = await getUserData();

//   const resumeId = await fetch(`/api/resumes/user/${userId}`);
//   const res = await resumeId.json();
//   return res;
// }

// getResumeId();

async function getApplyUser() {
  const applyUser = document.getElementById('apply-user-list');

  const response = await fetch(`/api/applications/applyuser/${jobpostingId}`);
  const data = await response.json();
  console.log(data);

  const temp = data
    .map((data) => {
      return `
            <div class="container col-12" id="apply-user-list">
              <div class="row">
                <div class="col-4">
                  <div class="profile-box">
                    <img
                      src="${data.user.image}"
                      id="image"
                      class="user-img"
                      alt=""
                      srcset=""
                      onerror="this.src='/img/userImg.jpg';"
                    />
                  </div>
                </div>
                <div class="col-8">
                  <div class="row">
                    <div class="apply-user-list">
                      <div class="apply-user-card">
                        <h4 class="user-name">${data.user.name}</h4>
                        <h6 class="user-phone">${data.user.phone}</h6>
                        <h6 class="user-email">${data.user.email}</h6>
                      </div>
                      <div>
                        <button
                          type="button"
                          class="btn btn-outline-primary"
                          id="resume-btn"
                          style="margin-right: 10px"
                        >
                          이력서 보기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
          </div>
              `;
    })
    .join('');

  applyUser.innerHTML = temp;

  const resumeButton = document.getElementById('resume-btn');

  resumeButton.addEventListener('click', function () {
    const resumeId = 1; // resumeId 값 설정 // 수정필요!!!!
    window.location.href = `/subpage/${jobpostingId}/${resumeId}?id=${jobpostingId}&resumeId=${resumeId}`;
  });
}

getApplyUser();
