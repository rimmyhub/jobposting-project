let btnContainer;
document.addEventListener('DOMContentLoaded', (e) => {
  btnContainer = document.getElementById('btn-container');
  e.preventDefault();
  hideBtn();
});
// 메세지보내기버튼 숨기기
function hideBtn() {
  const type = window.localStorage.getItem('type');
  if (type === 'company' || !type) {
    btnContainer.style.display = 'none';
  }
}

// 회사 정보를 가져오는 함수
async function fetchCompanyData(companyId) {
  try {
    // 서버 API로 데이터를 요청
    const response = await fetch(`/api/companies/${companyId}`);
    if (response.ok) {
      const companyData = await response.json();

      // 회사 정보 업데이트
      const imageElement = document.querySelector('.image');
      const titleElement = document.querySelector('.fs-2.fw-semibold');
      const introductionElement = document.querySelector('.fw-normal');
      const websiteElement = document.querySelector('.website');
      const businessElement = document.querySelector('.business');
      const employeesElement = document.querySelector('.employees');
      const addressElement = document.querySelector('.address');

      imageElement.src = companyData.image;
      titleElement.textContent = companyData.title;
      introductionElement.textContent = companyData.introduction;
      websiteElement.textContent = companyData.website;
      businessElement.textContent = companyData.business;
      employeesElement.textContent = companyData.employees;
      addressElement.textContent = companyData.address;

      // 카카오맵 초기화 함수 호출
      initializeMap(companyData.address);
    } else {
      throw new Error('회사 데이터를 불러오는데 실패했습니다.');
    }
  } catch (error) {
    console.error('회사 데이터를 불러오는데 실패했습니다:', error.message);
    throw new Error('회사 데이터를 불러오는데 실패했습니다.');
  }
}

// 카카오맵 초기화 함수
function initializeMap(address) {
  // 카카오맵 위치 설정
  var mapContainer = document.getElementById('map'),
    mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

  // 지도를 생성
  var map = new kakao.maps.Map(mapContainer, mapOption);

  // 주소-좌표 변환 객체를 생성
  var geocoder = new kakao.maps.services.Geocoder();

  // 주소로 좌표를 검색
  geocoder.addressSearch(address, function (result, status) {
    // 정상적으로 검색이 완료됐으면
    if (status === kakao.maps.services.Status.OK) {
      var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

      // 결과값으로 받은 위치를 마커로 표시
      var marker = new kakao.maps.Marker({
        map: map,
        position: coords,
      });

      // 인포윈도우로 장소에 대한 설명을 표시
      var infowindow = new kakao.maps.InfoWindow({
        content:
          '<div style="width:150px;text-align:center;padding:6px 0;">회사 위치</div>',
      });
      infowindow.open(map, marker);

      // 지도의 중심을 결과값으로 받은 위치로 이동
      map.setCenter(coords);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const companyId = window.location.pathname.split('/').pop();
  fetchCompanyData(companyId);
});

// 채용공고 정보를 가져오는 함수
async function fetchJobPostingData(companyId) {
  try {
    // 서버 API로 데이터를 요청
    const response = await fetch(`/api/jobpostings/company/${companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const jobPostingData = await response.json();

      // 채용공고 정보 업데이트
      const jobTitleElement = document.querySelector('.job-title');
      const jobCareerElement = document.querySelector('.job-career');
      const jobSalaryElement = document.querySelector('.job-salary');
      const jobEducationElement = document.querySelector('.job-education');

      if (jobPostingData.length > 0) {
        const firstJobPosting = jobPostingData[0];
        jobTitleElement.textContent = firstJobPosting.title;
        jobCareerElement.textContent = firstJobPosting.career;
        jobSalaryElement.textContent = firstJobPosting.salary;
        jobEducationElement.textContent = firstJobPosting.education;
      }
    } else {
      throw new Error('채용 공고 데이터를 불러오는데 실패했습니다.');
    }
  } catch (error) {
    console.error('채용 공고 데이터를 불러오는데 실패했습니다:', error.message);
    throw error;
  }
}

// 페이지가 로드될 때 특정 회사 ID를 추출하고 데이터를 가져옵니다.
document.addEventListener('DOMContentLoaded', function () {
  const companyId = window.location.pathname.split('/').pop();
  fetchJobPostingData(companyId);
});

// 리뷰 작성
async function createReview() {
  try {
    const companyId = window.location.pathname.split('/').pop();
    const title = document.getElementById('reviewTitle').value;
    const comment = document.getElementById('reviewContent').value;
    const star = document.getElementById('reviewRating').value;

    const response = await fetch(`/comments/${companyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, comment, star }),
    });

    if (response.ok) {
      // 리뷰 작성 성공
      fetchReviews(companyId); // 리뷰 작성 후 리뷰 목록 업데이트
    } else {
      // 리뷰 작성 실패 처리
      console.error('리뷰 작성에 실패했습니다.');
    }
  } catch (error) {
    console.error('리뷰 작성 중 오류가 발생했습니다:', error.message);
    throw new Error('리뷰 작성에 실패했습니다.');
  }
}

// 리뷰 조회
async function fetchReviews(companyId) {
  try {
    const response = await fetch(`/comments/${companyId}`);

    if (response.ok) {
      const reviewData = await response.json();
      displayReviews(reviewData);
    } else {
      console.error('리뷰를 불러오는데 실패했습니다.');
    }
  } catch (error) {
    console.error('리뷰를 불러오는 중 오류가 발생했습니다:', error.message);
  }
}

// 페이지 로드 시 리뷰 데이터를 가져오도록 호출
function loadReviewsOnPageLoad() {
  const companyId = window.location.pathname.split('/').pop();
  fetchReviews(companyId);
}

// 리뷰 수정
async function updateReview(companyId, commentId, title, comment, star) {
  try {
    const response = await fetch(`/comments/${companyId}/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, comment, star }),
    });

    if (response.ok) {
      fetchReviews(companyId); // 리뷰 수정 후 리뷰 목록 업데이트
    } else {
      // 리뷰 수정 실패 처리
      console.error('리뷰 수정에 실패했습니다.');
    }
  } catch (error) {
    console.error('리뷰 수정 중 오류가 발생했습니다:', error.message);
  }
}

// 리뷰 삭제
async function deleteReview(companyId, commentId) {
  try {
    if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      const response = await fetch(`/comments/${companyId}/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchReviews(companyId); // 리뷰 삭제 후 리뷰 목록 업데이트
      } else {
        console.error('리뷰 삭제에 실패했습니다.');
      }
    }
  } catch (error) {
    console.error('리뷰 삭제 중 오류가 발생했습니다:', error.message);
  }
}

// 리뷰 표시
function displayReviews(reviewData) {
  const reviewList = document.getElementById('reviewList');
  reviewList.innerHTML = '';

  if (reviewData.length === 0) {
    const noReviewElement = document.createElement('p');
    noReviewElement.textContent = '아직 작성된 리뷰가 없습니다.';
    reviewList.appendChild(noReviewElement);
  } else {
    const companyId = window.location.pathname.split('/').pop();
    reviewData.forEach((review) => {
      const reviewElement = document.createElement('div');
      reviewElement.classList.add('mb-4', 'review-container');
      reviewElement.dataset.commentId = review.id;

      const titleElement = document.createElement('p');
      titleElement.classList.add('text-start', 'review-title');
      titleElement.textContent = review.title;

      const starElement = document.createElement('p');
      starElement.classList.add('text-start', 'review-star');
      starElement.textContent = '⭐'.repeat(review.star);

      const commentElement = document.createElement('p');
      commentElement.classList.add('text-start', 'review-comment');
      commentElement.textContent = review.comment;

      // 리뷰 수정 버튼
      const editButton = document.createElement('button');
      editButton.classList.add(
        'btn',
        'btn-primary',
        'fa-solid',
        'fa-pen',
        'me-2',
      );
      editButton.textContent = '수정';

      let editFormVisible = false;

      editButton.addEventListener('click', async function () {
        try {
          const commentId = this.closest('.mb-4').dataset.commentId;
          if (!commentId) {
            console.error('리뷰 ID가 없습니다.');
            return;
          }

          if (editFormVisible) {
            const editForm =
              this.closest('.mb-4').querySelector('.edit-review-form');
            if (editForm) {
              editForm.remove();
              editFormVisible = false;
            }
          } else {
            const editForm = document.createElement('form');
            editForm.classList.add('edit-review-form');

            const gridContainer = document.createElement('div');
            gridContainer.classList.add('container');

            const gridRow = document.createElement('div');
            gridRow.classList.add('row');

            const leftColumn = document.createElement('div');
            leftColumn.classList.add('col-6');
            const titleLabel = document.createElement('label');
            titleLabel.textContent = '제목';
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.value = review.title;
            titleInput.classList.add('form-control');
            const starLabel = document.createElement('label');
            starLabel.textContent = '별점';
            const starInput = document.createElement('select');
            starInput.classList.add('form-select');
            for (let i = 1; i <= 5; i++) {
              const option = document.createElement('option');
              option.value = i;
              option.text = '⭐'.repeat(i);
              if (i === review.star) {
                option.selected = true;
              }
              starInput.appendChild(option);
            }

            const rightColumn = document.createElement('div');
            rightColumn.classList.add('col-6');
            const commentLabel = document.createElement('label');
            commentLabel.textContent = '내용';
            const commentInput = document.createElement('textarea');
            commentInput.rows = 4;
            commentInput.value = review.comment;
            commentInput.classList.add('form-control');

            const submitButton = document.createElement('button');
            submitButton.type = 'button';
            submitButton.textContent = '수정 완료';
            submitButton.style.marginTop = '10px';
            submitButton.classList.add('btn', 'btn-primary');

            submitButton.addEventListener('click', async function () {
              const updatedTitle = titleInput.value;
              const updatedComment = commentInput.value;
              const updatedStar = parseInt(starInput.value);

              if (updatedTitle && updatedComment && !isNaN(updatedStar)) {
                await updateReview(
                  companyId,
                  commentId,
                  updatedTitle,
                  updatedComment,
                  updatedStar,
                );
                editForm.remove();
                fetchReviews(companyId);
              }
            });

            leftColumn.appendChild(titleLabel);
            leftColumn.appendChild(titleInput);
            leftColumn.appendChild(starLabel);
            leftColumn.appendChild(starInput);
            rightColumn.appendChild(commentLabel);
            rightColumn.appendChild(commentInput);

            gridRow.appendChild(leftColumn);
            gridRow.appendChild(rightColumn);

            gridContainer.appendChild(gridRow);

            editForm.appendChild(gridContainer);
            editForm.appendChild(submitButton);

            this.closest('.mb-4').appendChild(editForm);
            editFormVisible = true;
          }
        } catch (error) {
          console.error('리뷰 수정 중 오류가 발생했습니다:', error.message);
        }
      });

      // 리뷰 삭제 버튼
      const deleteButton = document.createElement('button');
      deleteButton.classList.add(
        'btn',
        'btn-secondary',
        'fa-solid',
        'fa-trash',
        'ms-2',
      );
      deleteButton.textContent = '삭제';

      deleteButton.addEventListener('click', async function () {
        try {
          const commentId = this.closest('.mb-4').dataset.commentId;
          if (commentId) {
            const companyId = window.location.pathname.split('/').pop();
            if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
              await deleteReview(companyId, commentId);
            }
          } else {
            console.error('리뷰 ID가 없습니다.');
          }
        } catch (error) {
          console.error('리뷰 삭제 중 오류가 발생했습니다:', error.message);
        }
      });

      editButton.style.marginBottom = '5px';
      deleteButton.style.marginBottom = '5px';

      reviewElement.appendChild(titleElement);
      reviewElement.appendChild(starElement);
      reviewElement.appendChild(commentElement);
      reviewElement.appendChild(editButton);
      reviewElement.appendChild(deleteButton);
      reviewList.appendChild(reviewElement);

      // 리뷰 컨테이너를 reviewList에 추가
      reviewList.appendChild(reviewElement);
    });
  }
}

// 페이지가 로드될 때 리뷰 데이터를 가져오도록 설정
document.addEventListener('DOMContentLoaded', loadReviewsOnPageLoad);
