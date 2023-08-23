// 파라미터값 가져오기
let params;
document.addEventListener('DOMContentLoaded', async () => {
  params = document.location.pathname.split('/')[2];
});
const signin = document.getElementById('signin');

// 로그인 버튼
signin.addEventListener('click', () => {
  login(params);
});

// 로그인
const login = async (type) => {
  const email = document.getElementById('input-email').value;
  const password = document.getElementById('input-password').value;
  let isSuccess;
  if (type === 'user') {
    await fetch('/api/auth/user', {
      // api앞에 /를 붙이지 않으면 현재 주소창의 3000바로 옆에 있는 params값이 붙는다.
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        role: type,
      }),
    })
      .then((el) => {
        isSuccess = el.ok;
      })
      .catch((e) => {
        console.log(e);
      });
  } else if (type === 'company') {
    await fetch('/api/auth/company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        role: type,
      }),
    })
      .then((el) => {
        isSuccess = el.ok;
      })
      .catch((e) => {
        console.log(e);
      });
  }
  if (isSuccess) {
    // location.href = '/';
  } else {
    alert('로그인에 실패하였습니다.');
  }
};
