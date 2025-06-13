import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: number): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      user: { id: userId } as any,
    });
    return await this.projectsRepository.save(project);
  }

  async findAll(userId: number): Promise<Project[]> {
    return await this.projectsRepository.find({
      where: { user: { id: userId } },
      relations: ['tasks'],
    });
  }

  async findOne(id: number, userId: number): Promise<Project> {
    return await this.projectsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['tasks'],
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, userId: number): Promise<Project> {
    await this.projectsRepository.update(
      { id, user: { id: userId } },
      updateProjectDto,
    );
    return await this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.projectsRepository.delete({ id, user: { id: userId } });
  }
}