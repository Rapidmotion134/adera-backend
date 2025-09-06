import { Injectable } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Repository } from 'typeorm';
import { Page } from './entities/page.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepo: Repository<Page>,
  ) {}

  async create(createPageDto: CreatePageDto) {
    const page = this.pageRepo.create(createPageDto);
    return await this.pageRepo.save(page);
  }

  async findAll() {
    return await this.pageRepo.find();
  }

  async findOne(id: number) {
    return await this.pageRepo.findBy({ id });
  }

  async update(id: number, updatePageDto: UpdatePageDto) {
    const existingPage = await this.pageRepo.findOneBy({ id });
    Object.assign(existingPage, updatePageDto);
    return await this.pageRepo.save(existingPage);
  }

  remove(id: number) {
    return this.pageRepo.delete({ id });
  }
}
