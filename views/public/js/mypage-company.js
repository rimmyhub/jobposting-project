// 회사 정보 불러오기
const companyTitle = document.querySelector('company-title'); // 회사이름
const companyIntroduction = document.querySelector('company-introduction'); // 소개
const companyWebsite = document.querySelector('company-website'); // 웹사이트
const companyBusiness = document.querySelector('company-business'); // 업계
const companyEmployees = document.querySelector('company-employees'); // 직원수
const companyAddress = document.querySelector('company-address'); // 본사 주소

async function getCompany() {
  try {
    const response = await fetch('/api/companies/company');
    const data = await response.json();
    console.log(companyData);

    const { title, introduction, website, business, employees, address } = data;
    companyTitle.textContent = title;
    companyIntroduction.textContent = introduction;
    companyWebsite.textContent = website;
    companyBusiness.textContent = business;
    companyEmployees.textContent = employees;
    companyAddress.textContent = address;
  } catch (error) {
    console.error('An error occurred:', error);
  }
}
getCompany();
