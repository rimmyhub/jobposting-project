// 파라미터값 가져오기
document.addEventListener('DOMContentLoaded', async () => {
  getResumes();
});

// 모든 유저정보 가져오기
const getResumes = async () => {
  const jobseekerList = document.getElementById('jobseeker-list');
  try {
    const datas = await fetch('/api/resumes')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log(err);
      });

    datas.forEach((el) => {
      const column = document.createElement('div');
      column.innerHTML = `<div id="${el.id}" OnClick="location.href='/subpage/${el.user.id}/${el.id}?id=${el.user.id}&resumeId=${el.id}'" class="jobseeker-card">
                          <img
                            class="jobseeker-img"
                            src="/img/userImg.jpg"
                            alt=""
                            srcset=""
                          />
                          <div class="jobseeker-info">
                            <div class="jobseeker-name">${el.user.name}</div>
                            <div class="jobseeker-job">${el.content}</div>
                          </div>
                        </div>`;
      jobseekerList.append(column);
    });
  } catch (error) {
    console.error(error);
  }
};

const logout = document.getElementById('logout');
if (logout) {
  logout.addEventListener('click', async () => {
    deleteCookie();
  });
}

async function deleteCookie() {
  let isSuccess;
  await fetch('/api/auth/logout', {
    method: 'DELETE',
  })
    .then((el) => {
      isSuccess = el.ok;
    })
    .catch((e) => {
      console.log(e);
    });
  if (isSuccess) {
    alert('로그아웃 되었습니다.');
    location.href = '/';
  }
}

// 채용공고 영역
const jobpostingBox = document.querySelector('#jobposting-list');

function jobpostingAppendTemp(data) {
  const temp = data
    .map((jobposting) => {
      return `
              <div class="jobposting-card" id="jobposting-card" onclick="goToJobpostingSubpage(${jobposting.id})">
                <div>
                  <div class="jobposting-title" id="jobposting-title">
                  ${jobposting.title}
                  </div>
                  <div class="jobposting-job" id="jobposting-job">${jobposting.dueDate}</div>
                  <p>${jobposting.workArea}</p>
                </div>
              </div>
              `;
    })
    .join('');

  jobpostingBox.insertAdjacentHTML('beforeend', temp);
}

async function getJobposting() {
  try {
    const jobpostingData = await fetch(`/api/jobpostings?page=1`);
    const jobpostingsData = await jobpostingData.json();
    jobpostingAppendTemp(jobpostingsData);
  } catch (error) {
    console.log(error);
  }
}

getJobposting();
const addJobpostingBtn = document.querySelector('#jobposting-add-btn');
addJobpostingBtn.addEventListener('click', async function () {
  const page = this.getAttribute('data-page');
  if (!page) {
    const res = await fetch(`/api/jobpostings?page=2`);
    const data = await res.json();
    jobpostingAppendTemp(data);
    this.setAttribute('data-page', 3);
  } else {
    const res = await fetch(`/api/jobpostings?page=${page}`);
    const data = await res.json();
    jobpostingAppendTemp(data);
    this.setAttribute('data-page', Number(page) + 1);
  }
});

function goToJobpostingSubpage(jobpostingId) {
  const subPageUrl = `/jobposting/${jobpostingId}`;
  window.location.href = subPageUrl;
}

// 회사 영역
const companiesBox = document.querySelector('#companies-list');
function companiesAppendTemp(data) {
  const temp = data
    .map((company) => {
      return `
              <div class="jobposting-card" id="companies-card" onclick="goToCompanySubpage(${company.id})">
              <img
                class="jobposting-img"
                id="companies-img"
                src="${company.image}"
                alt=""
                srcset=""
                onerror="this.src='/img/company.jpg';"
              />
              <div>
                <div class="jobposting-title" id="companies-title">
                ${company.title}
                </div>
                <div class="jobposting-job" id="companies-job">${company.business}</div>
                <p>${company.employees}</p>
              </div>
            </div>
          `;
    })
    .join('');
  companiesBox.insertAdjacentHTML('beforeend', temp);
}
async function getCompanies() {
  try {
    const companyData = await fetch(`/api/companies?page=1`);
    const companiesData = await companyData.json();
    companiesAppendTemp(companiesData);
  } catch (error) {
    console.error(error);
  }
}
getCompanies();
const addCompaniesBtn = document.querySelector('#companies-add-btn');
addCompaniesBtn.addEventListener('click', async function () {
  const page = this.getAttribute('data-page');
  if (!page) {
    const res = await fetch(`/api/companies?page=2`);
    const data = await res.json();
    companiesAppendTemp(data);
    this.setAttribute('data-page', 3);
  } else {
    const res = await fetch(`/api/companies?page=${page}`);
    const data = await res.json();
    companiesAppendTemp(data);
    this.setAttribute('data-page', Number(page) + 1);
  }
});

function goToCompanySubpage(companyId) {
  const subPageUrl = `/subpage/company/${companyId}`;
  window.location.href = subPageUrl;
}

// 지도를 생성
var mapContainer = document.getElementById('map'); // 지도를 표시할 div
var mapOption = {
  center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
  level: 3, // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성

var locImageSrc =
  'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

// 주소와 마커 정보를 배열로 정의
var address = [];

// 마커 이미지 크기 설정
var imageSize = new kakao.maps.Size(20, 30);

// 내 위치 마커 생성 (디폴트 이미지 사용)
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude; // 위도
    var lon = position.coords.longitude; // 경도

    var locPosition = new kakao.maps.LatLng(lat, lon); // 내 위치의 좌표
    var locMarker = new kakao.maps.Marker({
      map: map, // 마커를 표시할 지도
      position: locPosition, // 마커를 표시할 위치
      title: '현재 위치', // 마커의 타이틀
    });

    // 인포윈도우로 내 위치를 표시
    var locInfowindow = new kakao.maps.InfoWindow({
      content: '<div style="padding:5px;">현재 위치</div>',
    });
    locInfowindow.open(map, locMarker);

    // 지도의 중심을 내 위치로 변경
    map.setCenter(locPosition);

    // 서버에서 회사 정보를 가져오는 API 엔드포인트 URL
    var apiUrl = '/api/companies/addresses';

    // 서버에서 회사 정보를 가져오고, 주소 정보만 추출하여 마커를 표시하는 함수
    fetch(apiUrl)
      .then((response) => response.json())
      .then((addresses) => {
        address = addresses.map(function (addressInfo) {
          // 주소를 좌표로 변환하는 Geocoder 객체를 생성
          var geocoder = new kakao.maps.services.Geocoder();

          // 주소로 좌표를 검색
          geocoder.addressSearch(addressInfo.title, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
              // 좌표를 얻어옵니다.
              var latlng = new kakao.maps.LatLng(result[0].y, result[0].x);

              // 주소 정보와 좌표 정보를 함께 저장
              addressInfo.latlng = latlng;

              // 지도에 마커를 표시
              var marker = new kakao.maps.Marker({
                map: map,
                position: latlng,
                title: addressInfo.title,
                image: new kakao.maps.MarkerImage(locImageSrc, imageSize),
              });

              // 마커 클릭 이벤트를 설정
              kakao.maps.event.addListener(marker, 'click', function () {
                var infowindow = new kakao.maps.InfoWindow({
                  content:
                    '<div style="padding:5px;">' + addressInfo.title + '</div>',
                });
                infowindow.open(map, marker);
              });
            }
          });

          return addressInfo;
        });
      })
      .catch(function (error) {
        console.error('Error fetching data:', error);
      });
  });
}

// HTML5의 geolocation으로 사용할 수 있는지 확인
if (navigator.geolocation) {
  // GeoLocation을 이용해서 접속 위치를 얻어옵니다
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude; // 위도
    var lon = position.coords.longitude; // 경도

    var locPosition = new kakao.maps.LatLng(lat, lon); // 내 위치의 좌표
    var locMarker = new kakao.maps.Marker({
      map: map, // 마커를 표시할 지도
      position: locPosition, // 마커를 표시할 위치
      title: '현재 위치', // 마커의 타이틀
    });

    // 인포윈도우로 내 위치를 표시
    var locInfowindow = new kakao.maps.InfoWindow({
      content: '<div style="padding:5px;">현재 위치</div>',
    });
    locInfowindow.open(map, locMarker);

    // 지도의 중심을 내 위치로 변경
    map.setCenter(locPosition);
  });
}
