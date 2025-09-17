import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentRepository.create(createPaymentDto);
    return await this.paymentRepository.save(payment);
  }

  findAll() {
    return this.paymentRepository.find({
      relations: { user: true },
    });
  }

  findAllForUser(userId: number) {
    return this.paymentRepository.find({
      relations: { user: true },
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number, user: any) {
    const payment = await this.paymentRepository.findOne({
      relations: { user: true },
      where: { id },
      cache: false, // Disable cache for the query
    });
    if (user.userId === payment.user.id || user.isAdmin) {
      return payment;
    }
    return new UnauthorizedException();
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const existingPayment = await this.paymentRepository.findOneBy({ id });
    Object.assign(existingPayment, updatePaymentDto);
    return await this.paymentRepository.save(existingPayment);
  }

  remove(id: number) {
    return this.paymentRepository.delete({ id });
  }
}
