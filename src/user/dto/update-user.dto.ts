import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// CreateUserDto에서 상속을 받는데 값을 다 입력하지 않아도 된다.
export class UpdateUserDto extends PartialType(CreateUserDto) {}
