import { Test } from '@nestjs/testing';
import { User } from 'src/apis/domain/user.entity';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { userStub } from './stubs/user.stub';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailService } from 'src/apis/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserGuard } from 'src/apis/auth/jwt/jwt.user.guard';

jest.mock('../user.service');

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userStub(),
        },

        JwtService,
        UserGuard,
        ConfigService,
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  describe('getUser', () => {
    describe('getUser가 호출될때', () => {
      let user: User;

      beforeEach(async () => {
        user = await userController.findUser(userStub().id);
      });

      test('userService를 호출해야 한다', () => {
        expect(userService.getUserById).toHaveBeenCalledWith(userStub().id);

        expect(user).toEqual(userStub());
      });
    });
  });
});
