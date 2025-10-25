import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly phone: string;
  readonly address: string;
}

export class CompleteSignupDto extends PartialType(CreateUserDto) {
  readonly password: string;
  readonly phone: string;
  readonly address: string;
}
