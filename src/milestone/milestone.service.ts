import { Injectable } from '@nestjs/common';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from './entities/milestone.entity';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectRepository(Milestone)
    private readonly milestoneRepo: Repository<Milestone>,
  ) {}

  async create(createMilestoneDto: CreateMilestoneDto) {
    return await this.milestoneRepo.save(createMilestoneDto);
  }

  async findAll() {
    return await this.milestoneRepo.find();
  }

  async findOne(id: number) {
    return await this.milestoneRepo.findOneBy({ id });
  }

  async findForUser(userId: number) {
    return await this.milestoneRepo.find({
      relations: ['user'],
      where: { user: { id: userId } },
    });
  }

  async update(id: number, updateMilestoneDto: UpdateMilestoneDto) {
    const existingMilestone = await this.findOne(id);
    Object.assign(existingMilestone, updateMilestoneDto);
    return await this.milestoneRepo.save(existingMilestone);
  }

  remove(id: number) {
    return this.milestoneRepo.delete({ id });
  }
}
