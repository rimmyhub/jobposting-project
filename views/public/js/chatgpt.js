// 필요한 모듈과 라이브러리 import
require('dotenv').config();

const axios = require('axios');
const tiktoken = require('tiktoken'); // tiktoken 라이브러리 추가

// API 키를 환경 변수에서 가져오기
const apiKey = process.env.OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions';

// 자기소개서 내용 사용자 입력 수집
const userName = 'Jane Doe';
const selfIntroduction = '여기에 500자 이내로 자기소개서 내용을 입력하세요.';

// 프롬프트 구성
const prompt = `Write a self-introduction for ${userName}. Include information about their experience: ${selfIntroduction}`;

// 토큰 개수 제한 설정 (한글로 500자의 경우 대략 100~150 토큰, 150토큰으로 제한)
const maxTokens = 150;

// 토큰 개수 계산 함수
function countTokens(text) {
  const tokenizer = new tiktoken.Tokenizer();
  tokenizer.add_text(text);
  return tokenizer.count_tokens();
}

// 자기소개서 내용을 토큰 개수로 제한
const selfIntroTokens = countTokens(selfIntroduction);
if (selfIntroTokens > maxTokens) {
  console.error('자기소개서 토큰 개수가 제한을 초과합니다.');
  process.exit(1); // 프로세스 종료 또는 오류 처리 작업 수행
}

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
  {
    role: 'user',
    content: selfIntroduction.substring(0, maxTokens),
  },
];

// api 호출 설정
const headers = {
  Authorization: `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
};

// api 호출
axios
  .post(
    apiUrl,
    {
      model: 'text-babbage-001',
      prompt,
      messages: conversation,
      max_tokens: maxTokens, // 토큰 개수 제한 추가
    },
    { headers },
  )
  .then((response) => {
    const selfIntroduction = response.data.choices[0].message.content;
    // 자기소개서 출력 또는 활용
    console.log('AI의 응답:', selfIntroduction); // AI의 응답을 console에 출력

    // 응답을 웹페이지에 표시
    // const responseDiv = document.getElementById('response');
    // responseDiv.textContent = aiReply;
  })
  .catch((error) => {
    console.error('API 호출 중 오류 발생:', error);

    // // 오류 메세지 표시
    // const errorDiv = document.getElementById('error');
    // errorDiv.textContent = 'API 호출 중 오류 발생:' + error.message;
  });
