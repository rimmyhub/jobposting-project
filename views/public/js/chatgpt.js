// import { axios } from '@axios';

// chatgpt.js 파일 내에서 dotenv 로드
require('dotenv').config();

// API 키를 환경 변수에서 가져오기
const apiKey = process.env.OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions';

// chatGPT에 전송할 대화 데이터
const conversation = [
  { role: 'system', content: 'You are a helpful assistant for job seekers.' },
  {
    role: 'user',
    content: '안녕하세요, 자기소개서를 작성하는데 도움이 필요해요.',
  },
  {
    role: 'assistant',
    content: '물론이에요. 자기소개서 작성에 도움을 드릴게요.',
  },
  {
    role: 'user',
    content: '저는 컴퓨터 공학 전공이고, 프로그래밍 경험이 있어요.',
  },
  {
    role: 'assistant',
    content:
      '컴퓨터 공학 전공과 프로그래밍 경험이 있으니까 자기소개서에 관련 내용을 어떻게 넣을지 얘기해보세요.',
  },
  {
    role: 'user',
    content:
      '제가 대학에서 데이터베이스와 웹 개발에 관련된 프로젝트를 진행했어요.',
  },
];

const headers = {
  Authorization: `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
};

axios
  .post(
    apiUrl,
    {
      model: 'text-babbage-001',
      messages: conversation,
    },
    { headers },
  )
  .then((response) => {
    const aiReply = response.data.choices[0].message.content;
    console.log('AI의 응답:', aiReply); // AI의 응답을 console에 출력

    // 응답을 웹페이지에 표시
    const responseDiv = document.getElementById('response');
    responseDiv.textContent = aiReply;
  })
  .catch((error) => {
    console.error('API 호출 중 오류 발생:', error);

    // 오류 메세지 표시
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = 'API 호출 중 오류 발생:' + error.message;
  });
