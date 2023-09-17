const jobpostingId = window.location.pathname.split('/')[2];

async function getApplyUser() {
  const applyUser = document.getElementById('apply-user-list');

  const response = await fetch(`/api/applications/applyuser/${jobpostingId}`);
  const data = await response.json();
  // console.log("test")
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
                          data-id=${data.user.id}
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

  // console.log('test');

  //resumeId 가져오기
  async function getResumeId(event) {
    const userId = event.target.getAttribute('data-id');
    const resumeIdResponse = await fetch(`/api/resumes/user/${userId}`);
    const resumeId = await resumeIdResponse.json();
    return resumeId;
  }

  const resumeButton = document.getElementById('resume-btn');
  resumeButton.addEventListener('click', async (event) => {
    const userId = event.target.getAttribute('data-id');
    const resumeId = await getResumeId(event);

    window.location.href = `/subpage/${userId}/${resumeId}?id=${userId}&resumeId=${resumeId}`;
  });
}

getApplyUser();
