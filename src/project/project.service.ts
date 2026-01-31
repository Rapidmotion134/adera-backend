import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    for (const milestone of createProjectDto.milestones) {
      for (const task of milestone.tasks) {
        for (const doc of task.documents ?? []) {
          if (!doc.productId) {
            doc.productId = this.generateProductIdForDocument();
          }
        }
      }
    }
    return await this.projectRepo.save(createProjectDto);
  }

  async findAll() {
    return await this.projectRepo.find({
      relations: ['user', 'admin'],
    });
  }

  async findOne(id: number) {
    return await this.projectRepo.findOne({
      where: { id },
      relations: ['milestones.tasks.documents', 'user', 'admin'],
    });
  }

  async findForUser(userId: number) {
    return await this.projectRepo.find({
      relations: ['user', 'admin'],
      where: { user: { id: userId } },
    });
  }

  async findForAdmin(userId: number) {
    return await this.projectRepo.find({
      relations: ['user', 'admin'],
      where: { admin: { id: userId } },
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const existingProject = await this.findOne(id);
    for (const milestone of updateProjectDto.milestones) {
      for (const task of milestone.tasks) {
        for (const doc of task.documents ?? []) {
          if (!doc.productId) {
            doc.productId = this.generateProductIdForDocument();
          }
        }
      }
    }
    Object.assign(existingProject, updateProjectDto);
    existingProject.lastUpdated = new Date();
    return await this.projectRepo.save(existingProject);
  }

  remove(id: number) {
    return this.projectRepo.delete({ id });
  }

  generateProductIdForDocument() {
    const timestamp = Date.now().toString(16).substring(0, 4);
    const randomPart = Math.random().toString(16).substring(2, 8);
    return `${timestamp}${randomPart}`;
  }
}
