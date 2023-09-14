// 회사 정보 불러오기
const companyImage = document.getElementById('image'); // 회사 이미지
const companyTitle = document.getElementById('company-title'); // 회사이름
const companyIntroduction = document.getElementById('company-introduction'); // 소개
const companyWebsite = document.getElementById('company-website'); // 웹사이트
const companyBusiness = document.getElementById('company-business'); // 업계
const companyEmployees = document.getElementById('company-employees'); // 직원수
const companyAddress = document.getElementById('company-address'); // 본사 주소

// 회사 정보 보여주기
async function getCompany() {
  try {
    const response = await fetch('/api/companies/company');
    const data = await response.json();
    // console.log(data);

    const {
      title,
      introduction,
      website,
      business,
      employees,
      address,
      image,
    } = data;
    companyTitle.textContent = title;
    companyIntroduction.textContent = introduction;
    companyWebsite.textContent = website;
    companyBusiness.textContent = business;
    companyEmployees.textContent = employees;
    companyAddress.textContent = address;
    companyImage.src = image;
  } catch (error) {
    console.error(error);
  }
}
getCompany();

// 이미지 수정하기
async function getCompanyImage() {
  const companyImage = document.getElementById('image'); // 보이는 곳
  const imageUploadEl = document.getElementById('company-image'); // 회사 이미지
  const imageDeleteEl = document.getElementById('image-delete'); // 기본 프로필 적용
  const saveBtnEl = document.getElementById('save-btn');
  let imageUrl = companyImage.src; // 기존 이미지 URL 가져오기

  // 기본 프로필 적용하기
  imageDeleteEl.addEventListener('click', () => {
    imageUrl = '/img/company.jpg'; // 이미지 삭제 시 URL 업데이트
    companyImage.src = imageUrl; // 이미지 보여주기
  });

  imageUploadEl.addEventListener('change', async (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    // 파일 유효성 검사
    if (selectedFile) {
      if (selectedFile.size > 1 * 1024 * 1024) {
        alert('파일 용량은 최대 1MB입니다.');
        return;
      }

      if (
        !selectedFile.type.includes('jpeg') &&
        !selectedFile.type.includes('png')
      ) {
        alert('jpeg 또는 png 파일만 업로드 가능합니다!');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          imageUrl = data.url; // 업로드된 이미지 URL 업데이트
          companyImage.src = imageUrl; // 이미지 보여주기

          console.log(data);
        } else {
          throw new Error('이미지 업로드에 실패했습니다.');
        }
      } catch (error) {
        console.error(error);
        alert('이미지 업로드에 실패했습니다.');
      }
    }
  });

  saveBtnEl.addEventListener('click', async () => {
    if (imageUrl) {
      try {
        await saveCompanyImage(imageUrl);
        alert('이미지가 저장되었습니다.');
        window.location.reload();
      } catch (error) {
        console.error('이미지 저장 오류:', error);
        alert('이미지 저장에 실패했습니다.');
      }
    } else {
      alert('이미지를 먼저 업로드하세요.');
    }
  });

  async function saveCompanyImage(imageUrl) {
    try {
      const response = await fetch('/api/companies/image', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageUrl }),
      });

      if (!response.ok) {
        throw new Error('이미지 저장 실패');
      }
    } catch (error) {
      console.error('이미지 저장 오류:', error);
      throw error;
    }
  }
}
getCompanyImage();

// 채용공고 불러오기
async function getJobpostingData() {
  const jobposting = document.querySelector('.jobposting-list');
  const response = await fetch('/api/jobpostings/company');
  const data = await response.json();

  const temp = data
    .map((data) => {
      return `
              <div class="jobposting-card"
              >
              <h4 class="fw-semibold"
              id="jobposting-title"
              style="cursor: pointer;
              text-decoration: underline"
              data-id=${data.id}>
                ${data.title}
              </h4>
              <h6 id="jobposting-job">
              ${data.job}
              </h6>
              <h6 id="jobposting-duedate">${data.dueDate}</h6>
            </div>
            <button
              type="button"
              class="btn btn-outline-primary text-start"
              id="apply-user-button"
              style="margin-left: 0%"
              data-id=${data.id}
            >
              지원자 확인
            </button>
            </div>
            <hr />
            `;
    })
    .join('');

  jobposting.innerHTML = temp;

  // 채용공고 타이틀 선택 시 해당 채용 공고 화면으로 이동
  const titleInfo = document.querySelectorAll('#jobposting-title');
  // console.log(titleInfo);
  titleInfo.forEach((jobCardEl) => {
    jobCardEl.addEventListener('click', async (event) => {
      const jobpostingId = event.target.getAttribute('data-id');
      console.log(jobpostingId);
      window.location.href = `/jobposting/${jobpostingId}`;
    });
  });

  // 지원자 확인
  const applyUserBtn = document.querySelectorAll('#apply-user-button');
  applyUserBtn.forEach((applyUser) => {
    applyUser.addEventListener('click', async (event) => {
      const jobpostingId = event.target.getAttribute('data-id');
      window.location.href = `/applyuser/${jobpostingId}`;
    });
  });

  // 공고 편집 버튼 선택 시 공고 영역으로 화면 이동
  const applyEditBtn = document.querySelector('#apply-edit-button');
  applyEditBtn.addEventListener('click', async () => {
    window.location.href = `/apply/company`;
  });
}
getJobpostingData();
