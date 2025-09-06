import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsString({ message: 'First name must be a string' })
  readonly firstName: string;

  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @IsString({ message: 'Last name must be a string' })
  readonly lastName: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  readonly email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly password: string;

  readonly phone: string;
  readonly address1: string;
  readonly city: string;
  readonly zipcode: string;
}
