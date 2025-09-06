import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createAdmin(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    user.isAdmin = true;
    return await this.userRepo.save(user);
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    return await this.userRepo.save(user);
  }

  async seed() {
    let user = await this.userRepo.findOneBy({
      email: 'ameen.oumer@gmail.com',
    });
    if (!user) {
      user = this.userRepo.create({
        firstName: 'Ameen',
        lastName: 'Oumer',
        password: 'Test123',
        phone: '+251939881843',
        email: 'meen.oumer@gmail.com',
        address1: 'Addis Ababa',
        city: 'Addis Ababa',
        zipcode: '20002',
        isAdmin: false,
      });
      await this.userRepo.save(user);
      console.log('Table seeded successfully.');
    }
    const count = await this.userRepo.findBy({ isAdmin: true });
    if (count.length === 0) {
      const adminUser = this.userRepo.create({
        firstName: 'Benyam',
        lastName: 'Assegdw',
        password: 'Test123',
        phone: '+251983354391',
        email: 'benyamassegdw@gmail.com',
        address1: 'Addis Ababa',
        city: 'Addis Ababa',
        zipcode: '20002',
        isAdmin: true,
      });
      await this.userRepo.save(adminUser);
      console.log('Table seeded successfully.');
    } else {
      console.log('Table already populated, seeding skipped.');
    }
    const superAdmin = await this.userRepo.findOneBy({ isSuperAdmin: true });
    if (!superAdmin) {
      const superAdminUser = this.userRepo.create({
        firstName: 'Benyam',
        lastName: 'Assegdw',
        password: 'superTest123',
        phone: '+251983354391',
        email: 'benyamassegdw1@gmail.com',
        address1: 'Addis Ababa',
        city: 'Addis Ababa',
        zipcode: '20002',
        isAdmin: true,
        isSuperAdmin: true,
      });
      await this.userRepo.save(superAdminUser);
      console.log('Table seeded successfully.');
    } else {
      console.log('Table already populated, seeding skipped.');
    }
  }

  async findAll() {
    return await this.userRepo.find({
      where: { isAdmin: false },
      // relations: { services: true },
    });
  }

  async findAllAdmins() {
    return await this.userRepo.findBy({ isAdmin: true });
  }

  async userCount() {
    return await this.userRepo.count();
  }

  async findOne(id: number) {
    return await this.userRepo.findOne({
      // relations: { services: true },
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findOne(id);
    Object.assign(existingUser, updateUserDto);
    return await this.userRepo.save(existingUser);
  }

  async activationStatus(id: number) {
    const existingUser = await this.findOne(id);
    existingUser.isActive = !existingUser.isActive;
    return await this.userRepo.save(existingUser);
  }

  remove(id: number) {
    return this.userRepo.delete({ id });
  }
}
