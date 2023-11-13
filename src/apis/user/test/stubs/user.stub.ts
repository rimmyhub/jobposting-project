import { User } from 'src/apis/domain/user.entity';

export const userStub = (): User => {
  return {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    image: '',
    name: 'John Doe',
    phone: '1234567890',
    gender: 'M',
    address: '123 Main St',
    birth: '1996-12-11',
    verificationCode: 'xyz123',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    currentRefreshToken: 'token123',
    currentRefreshTokenExp: new Date(),
    educations: [],
    chat: [],
    applicant: [],
    resume: null,
    comment: [],
  };
};
