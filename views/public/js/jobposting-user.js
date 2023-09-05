// 이벤트 리스너가 DOM 트리 구성 후에 등록되도록 defer 속성이 설정되어 있으므로
// 문서가 로드될 때 실행됩니다.

const jobpostingId = window.location.pathname.split('/')[2];
console.log(jobpostingId);

const applyBtn = document.querySelector('.apply-btn');

// 지원하기 버튼
applyBtn.addEventListener('click', async (event) => {
  try {
    const response = await fetch(`/api/applications/${jobpostingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('성공적으로 지원하였습니다.');
    } else if (response.status === 500) {
      const data = await response.json();
      alert('로그인이 필요합니다.');
      window.location.href = '/signup';
      return;
    } else if (response.status === 403) {
      const data = await response.json();
      alert(data.message);
    } else {
      alert('오류가 발생했습니다.');
    }
  } catch (error) {
    console.error(error);
    alert('예기치 않은 오류가 발생했습니다.');
  }
});
