const signupBtn = document.getElementById('signup-btn');
let path;
document.addEventListener('DOMContentLoaded', async () => {
  path = document.location.pathname.split('/')[2];
});

signupBtn.addEventListener('click', () => {
  signup();
});

const signup = async () => {
  if (path === 'user') {
    console.log('유저회원가입', gender);
  } else if (path === 'company') {
    console.log('회사회원가입');
  }
};
