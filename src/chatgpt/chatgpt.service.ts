import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatgptService {
  async createChatgpt() {
    const openai = new OpenAI({
      apiKey: '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',
    });

    try {
      const openFun = async () => {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hello!' }],
          max_tokens: 30,
        });
        console.log(completion.choices[0].message.content);
      };
      openFun();
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        console.error(error.status); // e.g. 401오류
        console.error(error.message); // e.g. 전달한 인증 토큰이 잘못되었습니다
        console.error(error.code); // e.g. 잘못된 api키
        console.error(error.type); // e.g. 잘못된 요청 오류
      } else {
        // api가 아닌 오류
        console.log(error);
      }
    }
  }
}
