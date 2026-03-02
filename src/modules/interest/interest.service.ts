import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { AssociateInterestsDto } from './dto/associate-interests.dto';
import { Interest } from './entities/interest.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class InterestService {
  constructor(
    @InjectRepository(Interest)
    private interestRepository: Repository<Interest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createInterestDto: CreateInterestDto) {
    const existingInterest = await this.interestRepository.findOne({
      where: { name: createInterestDto.name },
    });

    if (existingInterest) {
      throw new BadRequestException('Interest already exists');
    }

    const interest = this.interestRepository.create(createInterestDto);
    return this.interestRepository.save(interest);
  }

  async findAll() {
    return this.interestRepository.find({
      select: ['id', 'name', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: number) {
    const interest = await this.interestRepository.findOne({
      where: { id },
      select: ['id', 'name', 'createdAt', 'updatedAt'],
    });

    if (!interest) {
      throw new NotFoundException(`Interest with ID ${id} not found`);
    }

    return interest;
  }

  async update(id: number, updateInterestDto: UpdateInterestDto) {
    const interest = await this.interestRepository.findOne({
      where: { id },
    });

    if (!interest) {
      throw new NotFoundException(`Interest with ID ${id} not found`);
    }

    if (updateInterestDto.name) {
      const existingInterest = await this.interestRepository.findOne({
        where: { name: updateInterestDto.name },
      });

      if (existingInterest && existingInterest.id !== id) {
        throw new BadRequestException('Interest with this name already exists');
      }
    }

    await this.interestRepository.update(id, updateInterestDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const interest = await this.interestRepository.findOne({
      where: { id },
    });

    if (!interest) {
      throw new NotFoundException(`Interest with ID ${id} not found`);
    }

    await this.interestRepository.delete(id);
    return { message: `Interest with ID ${id} has been deleted` };
  }

  async associateInterests(userId: number, associateInterestsDto: AssociateInterestsDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const interests = await this.interestRepository.find({
      where: { id: In(associateInterestsDto.interestIds) },
    });

    if (interests.length !== associateInterestsDto.interestIds.length) {
      throw new BadRequestException('One or more interests do not exist');
    }

    user.interests = interests;
    await this.userRepository.save(user);

    return {
      message: 'Interests associated successfully',
      interests: interests.map((i) => ({ id: i.id, name: i.name })),
    };
  }

  async getUserInterests(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        interests: {
          id: true,
          name: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      interests: user.interests,
    };
  }
}
