import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/enum/role';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: number) {
    const project = this.projectRepository.create({
      ...createProjectDto,
      userId,
    });

    return this.projectRepository.save(project);
  }

  async findAll() {
    return this.projectRepository.find({
      relations: ['user'],
      select: {
        id: true,
        name: true,
        description: true,
        budget: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
        },
      },
    });
  }

  async findAllByUser(userId: number, userRole: string) {
    const isAdmin = userRole === Role.Admin;
    const where = isAdmin ? {} : { userId };

    return this.projectRepository.find({
      where,
      relations: isAdmin ? ['user'] : [],
      select: {
        id: true,
        name: true,
        description: true,
        budget: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        user: isAdmin
          ? {
              id: true,
              email: true,
              firstname: true,
              lastname: true,
            }
          : false,
        userId: !isAdmin,
      },
    });
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        id: true,
        name: true,
        description: true,
        budget: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, userId: number, userRole: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (project.userId !== userId && userRole !== Role.Admin) {
      throw new ForbiddenException('You do not have permission to update this project');
    }

    await this.projectRepository.update(id, updateProjectDto);

    return this.findOne(id);
  }

  async remove(id: number, userId: number, userRole: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (project.userId !== userId && userRole !== Role.Admin) {
      throw new ForbiddenException('You do not have permission to delete this project');
    }

    await this.projectRepository.delete(id);

    return { message: `Project with ID ${id} has been deleted` };
  }

  async getRecommendedProjects(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!user.interests || user.interests.length === 0) {
      return this.findAll();
    }

    const recommendedProjects = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user')
      .leftJoinAndSelect(
        'user.interests',
        'interests',
        'interests.id IN (:...interestIds)',
        { interestIds: user.interests.map((i) => i.id) },
      )
      .select([
        'project.id',
        'project.name',
        'project.description',
        'project.budget',
        'project.category',
        'project.createdAt',
        'project.updatedAt',
        'user.id',
        'user.email',
        'user.firstname',
        'user.lastname',
      ])
      .distinct(true)
      .getMany();

    return recommendedProjects;
  }
}
