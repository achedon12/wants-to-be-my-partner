import {BadRequestException, ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateInvestmentDto} from './dto/create-investment.dto';
import {Investment} from './entities/investment.entity';
import {Project} from '../project/entities/project.entity';
import {User} from '../user/entities/user.entity';

@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(Investment)
    private investmentRepository: Repository<Investment>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto, investorId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: createInvestmentDto.projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${createInvestmentDto.projectId} not found`);
    }

    if (project.userId === investorId) {
      throw new BadRequestException('You cannot invest in your own project');
    }

    const investment = this.investmentRepository.create({
      amount: createInvestmentDto.amount,
      investorId,
      projectId: createInvestmentDto.projectId,
    });

    return this.investmentRepository.save(investment);
  }

  async findInvestments(userId: number, userRole: string) {
    const isAdmin = userRole === 'Admin';
    const where = isAdmin ? {} : { investorId: userId };

    return await this.investmentRepository.find({
      where,
      relations: ['project', 'project.user', 'investor'],
      select: {
        id: true,
        amount: true,
        createdAt: true,
        updatedAt: true,
        project: {
          id: true,
          name: true,
          description: true,
          budget: true,
          category: true,
          user: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        investor: isAdmin ? {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
        } : false,
      },
    });
  }

  async findProjectInvestments(projectId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const investments = await this.investmentRepository.find({
      where: { projectId },
      relations: ['investor'],
      select: {
        id: true,
        amount: true,
        createdAt: true,
        updatedAt: true,
        investor: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
        },
      },
    });

    return investments;
  }

  async remove(investmentId: number, investorId: number) {
    const investment = await this.investmentRepository.findOne({
      where: { id: investmentId },
    });

    if (!investment) {
      throw new NotFoundException(`Investment with ID ${investmentId} not found`);
    }

    if (investment.investorId !== investorId) {
      throw new ForbiddenException('You do not have permission to delete this investment');
    }

    await this.investmentRepository.delete(investmentId);

    return { message: `Investment with ID ${investmentId} has been deleted` };
  }
}

