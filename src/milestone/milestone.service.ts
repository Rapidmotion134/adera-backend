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
    for (const task of createMilestoneDto.tasks) {
      for (const doc of task.documents ?? []) {
        if (!doc.productId) {
          doc.productId = this.generateProductIdForDocument();
        }
      }
    }
    return await this.milestoneRepo.save(createMilestoneDto);
  }

  async findAll() {
    return await this.milestoneRepo.find();
  }

  async findOne(id: number) {
    return await this.milestoneRepo.findOne({
      where: { id },
      relations: ['tasks'],
    });
  }

  // async findForUser(userId: number) {
  //   return await this.milestoneRepo.find({
  //     relations: ['user', 'tasks', 'tasks.documents'],
  //     // where: { user: { id: userId } },
  //   });
  // }

  async update(id: number, updateMilestoneDto: UpdateMilestoneDto) {
    const existingMilestone = await this.findOne(id);
    Object.assign(existingMilestone, updateMilestoneDto);
    return await this.milestoneRepo.save(existingMilestone);
  }

  async updateStatus(
    id: number,
    status: 'pending' | 'in-progress' | 'completed',
  ) {
    const existingMilestone = await this.findOne(id);
    existingMilestone.status = status;
    return await this.milestoneRepo.save(existingMilestone);
  }

  async updateTaskStatus(
    id: number,
    taskId: number,
    status: 'pending' | 'in-progress' | 'completed',
  ) {
    const existingMilestone = await this.findOne(id);
    existingMilestone.tasks.forEach((task) => {
      if (task.id === taskId) {
        task.status = status;
      }
    });
    return await this.milestoneRepo.save(existingMilestone);
  }

  remove(id: number) {
    return this.milestoneRepo.delete({ id });
  }

  generateProductIdForDocument() {
    const timestamp = Date.now().toString(16).substring(0, 4);
    const randomPart = Math.random().toString(16).substring(2, 8);
    return `${timestamp}${randomPart}`;
  }
}
