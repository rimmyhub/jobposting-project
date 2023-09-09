// 회사 정보 불러오기
const companyImage = document.getElementById('image'); // 회사 이미지
const companyTitle = document.getElementById('company-title'); // 회사이름
const companyIntroduction = document.getElementById('company-introduction'); // 소개
const companyWebsite = document.getElementById('company-website'); // 웹사이트
const companyBusiness = document.getElementById('company-business'); // 업계
const companyEmployees = document.getElementById('company-employees'); // 직원수
const companyAddress = document.getElementById('company-address'); // 본사 주소

async function getCompany() {
  try {
    const response = await fetch('/api/companies/company');
    const data = await response.json();
    console.log(data);

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
    console.error('An error occurred:', error);
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
    imageUrl = '/img/userImg.jpg'; // 이미지 삭제 시 URL 업데이트
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
      const response = await fetch('/api/users/image', {
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

// 채용 정보 불러오기
