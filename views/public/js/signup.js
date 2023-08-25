const signupBtn = document.getElementById('signup-btn');
let path;
document.addEventListener('DOMContentLoaded', async () => {
  path = document.location.pathname.split('/')[2];
});

signupBtn.addEventListener('click', () => {
  signup();
});

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
  if (path === 'user') {
    const username = document.getElementById('input-username').value;
    const phone = document.getElementById('input-phone').value;
    const gender = document.getElementById('gender').value;
    const birth = document.getElementById('input-birth').value;

    await fetch('/api/users/signup', {
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

    await fetch('/api/companys/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        title: title,
        password: password,
        introduction: introduction,
        website: website,
        address: address,
        business: business,
        employees: Number(employees),
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
  }
};
