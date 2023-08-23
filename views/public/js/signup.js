const signupBtn = document.getElementById('signup-btn');
let path;
document.addEventListener('DOMContentLoaded', async () => {
  path = document.location.pathname.split('/')[2];
});

signupBtn.addEventListener('click', () => {
  signup();
});

const signup = async () => {
  let isSuccess;
  const email = document.getElementById('input-email').value;
  const password = document.getElementById('input-password').value;
  const address = document.getElementById('input-address').value;
  if (path === 'user') {
    const username = document.getElementById('input-username').value;
    const phone = document.getElementById('input-phone').value;
    const gender = document.getElementById('gender').value;
    const birth = document.getElementById('input-birth').value;

    await fetch('/api/users/signup', {
      // api앞에 /를 붙이지 않으면 현재 주소창의 3000바로 옆에 있는 params값이 붙는다.
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name: username,
        phone,
        gender,
        address,
        birth,
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
  } else if (path === 'company') {
    const confirmPassword = document.getElementById(
      'input-confirmpassword',
    ).value;
    const title = document.getElementById('input-title').value;
    const website = document.getElementById('input-website').value;
    const business = document.getElementById('input-business').value;
    const employees = document.getElementById('input-employees').value;
    const introduction = document.getElementById('input-introduction').value;

    console.log(
      email,
      password,
      title,
      introduction,
      website,
      address,
      business,
      employees,
    );
    await fetch('/api/companys/signup', {
      // api앞에 /를 붙이지 않으면 현재 주소창의 3000바로 옆에 있는 params값이 붙는다.
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        title,
        introduction,
        website,
        address,
        business,
        employees,
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
