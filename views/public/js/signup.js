const signupBtn = document.getElementById('signup-btn');
// 버튼 추가
const sendVerificationBtn = document.getElementById('send-verification-btn');
const verifyCodeBtn = document.getElementById('verify-code-btn');

let path;
// 인증을 false로 두고, 변수를 상위 스코프에 정의 추가
let isVerified = false;
document.addEventListener('DOMContentLoaded', async () => {
  path = document.location.pathname.split('/')[2];

  // 현재 경로를 기반으로 회원 유형 변수 설정
  isUser = path === 'user';
  isCompany = path === 'company';

  // 인증번호 전송 버튼의 클릭 이벤트 리스너
  sendVerificationBtn.addEventListener('click', async () => {
    console.log('sendVerificationBtn 클릭');
    const email = document.getElementById('input-email').value;

    const endpoint = isUser
      ? '/api/users/send-verification'
      : isCompany
      ? '/api/companies/send-verification'
      : '';

    if (endpoint) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email, // 이메일 추가
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        alert(data.message);
        isVerified = false;
      } else {
        console.error(data.message);
        alert(data.message);
      }
    } else {
      alert('잘못된 회원 유형입니다.');
    }
  });

  // 인증번호 확인 버튼의 클릭 이벤트 리스너
  verifyCodeBtn.addEventListener('click', async () => {
    const email = document.getElementById('input-email').value;
    const inputCode = document.getElementById('input-verification-code').value;

    const requestBody = {
      email,
      code: inputCode,
    };

    // 회원가입 타입에 따라 엔드포인트 설정
    const endpoint = isUser
      ? '/api/users/verify'
      : isCompany
      ? '/api/companies/verify'
      : '';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data);
      alert(data.message);
      // 인증 성공 시 인증 여부 표시
      isVerified = true;
    } else {
      console.log(data);
      alert('인증 실패: ' + data.message);
    }
  });
});

// 회원가입 버튼
signupBtn.addEventListener('click', async () => {
  if (isVerified) {
    signup();
  } else {
    alert('이메일 인증을 완료해주세요.');
  }
});

// 이미지 업로드
const userImage = document.getElementById('image');
const imageUploadEl = document.getElementById('upload-image');
imageUploadEl.addEventListener('change', async (e) => {
  const selectedFile = e.target.files[0];
  // console.log(selectedFile);
  if (selectedFile.size > 1 * 1024 * 1024) {
    alert('파일용량은 최대 1MB입니다.');
    return;
  }
  console.log(selectedFile.size);
  if (
    !selectedFile.type.includes('jpeg') &&
    !selectedFile.type.includes('png')
  ) {
    alert('jpeg 또는 png 파일만 업로드 가능합니다!');
    return;
  }
  const formData = new FormData();
  formData.append('file', selectedFile);
  // console.log(formData);
  // console.log(selectedFile);
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  console.log(response);
  const data = await response.json();
  console.log(data);
  imageUrl = data.url;
  userImage.setAttribute('src', imageUrl);
});
const signup = async () => {
  let isSuccess;
  const email = document.getElementById('input-email').value;
  const password = document.getElementById('input-password').value;
  const address = document.getElementById('input-address').value;

  // 회원가입 타입에 따라 엔드포인트 설정
  const endpoint = isUser
    ? '/api/users/signup'
    : isCompany
    ? '/api/companies/signup'
    : '';

  if (isUser) {
    const username = document.getElementById('input-username').value;
    const phone = document.getElementById('input-phone').value;
    const gender = document.getElementById('gender').value;
    const birth = document.getElementById('input-birth').value;

    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageUrl,
        email,
        password,
        name: username,
        phone,
        gender,
        address,
        birth,
        isVerified: isVerified,
      }),
    })
      .then((el) => {
        isSuccess = el.ok;
      })
      .catch((e) => {
        console.log(e);
      });
    if (isSuccess) {
      alert('회원가입 되었습니다.');
      location.href = '/signin/user';
    } else {
      alert('회원가입에 실패하였습니다.');
    }
  } else if (isCompany) {
    const title = document.getElementById('input-title').value;
    const website = document.getElementById('input-website').value;
    const business = document.getElementById('input-business').value;
    const employees = document.getElementById('input-employees').value;
    const introduction = document.getElementById('input-introduction').value;
    console.log(
      'signup = ',
      email,
      title,
      password,
      introduction,
      website,
      address,
      business,
      employees,
    );

    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageUrl,
        email: email,
        title: title,
        password: password,
        introduction: introduction,
        website: website,
        address: address,
        business: business,
        employees: Number(employees),
        isVerified: isVerified,
      }),
    })
      .then((el) => {
        isSuccess = el.ok;
      })
      .catch((e) => {
        console.log(e);
      });
    if (isSuccess) {
      alert('회원가입 되었습니다.');
      location.href = '/signin/company';
    } else {
      alert('회원가입에 실패하였습니다.');
    }
  }
};
