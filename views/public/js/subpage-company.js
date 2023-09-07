const companyId = window.location.pathname.split('/').pop();

// companyId를 사용하여 회사 정보 가져오기
const getCompanyData = async () => {
  try {
    const response = await fetch(`/api/companies/${companyId}`); // 서버의 API 엔드포인트로 요청
    console.log(response);
    if (!response.ok) {
      throw new Error('데이터를 불러오지 못했습니다.');
    }

    const data = await response.json(); // JSON 데이터 파싱
    console.log(data);

    // EJS 템플릿을 사용하여 데이터 랜더링
    const template = `
    <!-- 전체 컨테이너 -->
    <div class="container text-head">
      <!-- 브레드크롬 -->
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">Home</a></li>
          <li class="breadcrumb-item active" aria-current="page">
            subpage / company
          </li>
        </ol>
      </nav>

    <div class="container text-head">
    <img src="${data.image}" alt="회사 로고" style="max-width: 100%; height: auto;" />
      <p class="fs-2 fw-semibold" style="margin: 10px">${data.title}</p>
      <p class="fw-normal" style="margin: 10px">${data.introduction}</p>
    </div>
    <!-- 최상단 영역 메세지보내기까지 -->
      <div class="container">
        <button type="button" class="text-start btn btn-primary">
          메세지 보내기
        </button>
      </div>
    </div>
    <!-- 구분선 -->
    <hr />

      <!-- 회사 정보 영역 -->
      <div class="container text-center">
        <div class="row">
          <div class="col-4">
            <p class="text-start fs-5 fw-semibold" style="margin: 10px">회사 정보</p>
          </div>

          <div class="col-8">
            <!-- 웹사이트 -->
            <div class="row">
              <div class="col-4">
                <p class="text-start text-body-secondary">웹사이트</p>
              </div>
              <div class="col-8">
                <p class="text-start">${data.website}</p>
              </div>
            </div>
            <!-- 웹사이트 -->

            <!-- 업계 -->
            <div class="row">
              <div class="col-4">
                <p class="text-start text-body-secondary">업계</p>
              </div>
              <div class="col-8">
                <p class="text-start">${data.business}</p>
              </div>
            </div>
            <!-- 업계 -->

            <!-- 직원수 -->
            <div class="row">
              <div class="col-4">
                <p class="text-start text-body-secondary">직원 수</p>
              </div>
              <div class="col-8">
                <p class="text-start">${data.employees}</p>
              </div>
            </div>
            <!-- 직원수 -->
            
            <!-- 본사 주소 -->
            <div class="row">
              <div class="col-4">
                <p class="text-start text-body-secondary">본사 주소</p>
              </div>
              <div class="col-8">
                <p class="text-start">${data.address}</p>
              </div>
            </div>
            <!-- 지도 카카오 API 영역 -->
            <div id="map" style="width: 100%; height: 350px"></div>
          </div>
        </div>
      </div>
      <hr />
    </div>
    `;
    console.log(template);

    // HTML 요소에 템플릿 삽입
    const container = document.getElementById('company-container');
    container.innerHTML = template;

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
    geocoder.addressSearch(data.address, function (result, status) {
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
  } catch (error) {
    console.error(error);
  }
};

// getCompanyData 함수를 호출하여 회사 정보를 가져옴
getCompanyData();
