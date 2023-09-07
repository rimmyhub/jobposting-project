// 회사 정보를 가져오는 함수
async function fetchCompanyData(companyId) {
  try {
    // 서버 API로 데이터를 요청
    const response = await fetch(`/api/companies/${companyId}`);

    if (response.ok) {
      const companyData = await response.json();

      // 나머지 회사 정보 업데이트
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
      throw new Error('Failed to fetch company data');
    }
  } catch (error) {
    console.error('Error fetching company data:', error);
    throw error;
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

  // 지도를 생성합니다
  var map = new kakao.maps.Map(mapContainer, mapOption);

  // 주소-좌표 변환 객체를 생성합니다
  var geocoder = new kakao.maps.services.Geocoder();

  // 주소로 좌표를 검색합니다
  geocoder.addressSearch(address, function (result, status) {
    // 정상적으로 검색이 완료됐으면
    if (status === kakao.maps.services.Status.OK) {
      var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

      // 결과값으로 받은 위치를 마커로 표시합니다
      var marker = new kakao.maps.Marker({
        map: map,
        position: coords,
      });

      // 인포윈도우로 장소에 대한 설명을 표시합니다
      var infowindow = new kakao.maps.InfoWindow({
        content:
          '<div style="width:150px;text-align:center;padding:6px 0;">회사 위치</div>',
      });
      infowindow.open(map, marker);

      // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
      map.setCenter(coords);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const companyId = window.location.pathname.split('/').pop();
  fetchCompanyData(companyId);
});
