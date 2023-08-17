import { Controller } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Controller('companys')
export class CompanyController {
  constructor(private readonly usersService: UsersService) {}
}
