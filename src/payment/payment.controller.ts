import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Roles(Role.Admin)
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Roles(Role.Admin, Role.User)
  @Get(':userId')
  findAllForUser(@Param('userId') userId: string, @Req() req: Request) {
    if (req['user'].userId === +userId || req['user'].isAdmin) {
      return this.paymentService.findAllForUser(+userId);
    }
    return new UnauthorizedException();
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.paymentService.findOne(+id, req['user']);
  }

  @Roles(Role.Admin, Role.User)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Roles(Role.Admin, Role.User)
  @Patch('accept/:id')
  acceptPayment(@Param('id') id: string) {
    return this.paymentService.acceptPayment(+id);
  }

  @Roles(Role.Admin, Role.User)
  @Patch('reject/:id')
  rejectPayment(@Param('id') id: string) {
    return this.paymentService.rejectPayment(+id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
