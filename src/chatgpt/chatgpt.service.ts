import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatgptService {
  async createChatgpt(experience: string) {
    const openai = new OpenAI({
      apiKey: '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',
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: '자기소개서를 작성해주세요.' },
        { role: 'assistant', content: experience },
      ],
      max_tokens: 100,
    });

    const responseData = {
      message: completion.choices[0].message.content,
    };

    return JSON.stringify(responseData);
  }
}
