import { Injectable } from '@nestjs/common';
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
    return this.paymentRepository.find();
  }

  findOne(id: number) {
    return this.paymentRepository.findOneBy({ id });
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
