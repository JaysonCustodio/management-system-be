import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { projectId, ...taskData } = createTaskDto;
    const task = this.tasksRepository.create({
      ...taskData,
      project: { id: projectId } as any,
    });
    return await this.tasksRepository.save(task);
  }

  async findAll(projectId: number): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { project: { id: projectId } },
    });
  }

  async findOne(id: number): Promise<Task> {
    return await this.tasksRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { projectId, ...taskData } = updateTaskDto;
    if (projectId) {
      taskData['project'] = { id: projectId } as any;
    }
    await this.tasksRepository.update(id, taskData);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.tasksRepository.delete(id);
  }
}