import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UpdateProfileDto} from './dto/update-profile.dto';
import {User} from './entities/user.entity';
import {CryptoService} from '../../shared/services/crypto.service';
import {Role} from './enum/role';
import {Interest} from '../interest/entities/interest.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Interest)
        private interestRepository: Repository<Interest>,
        private cryptoService: CryptoService,
    ) {
    }

    async create(createUserDto: CreateUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: {email: createUserDto.email},
        });

        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await this.cryptoService.hashPassword(createUserDto.password);

        const newUser = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            role: Role.Entrepreneur,
        });

        return this.userRepository.save(newUser);
    }

    async findAll() {
        return this.userRepository.find({
            select: ['id', 'email', 'firstname', 'lastname', 'role', 'createdAt', 'updatedAt'],
        });
    }

    async findOne(id: number) {
        const user = await this.userRepository.findOne({
            where: {id},
            select: ['id', 'email', 'firstname', 'lastname', 'role', 'createdAt', 'updatedAt'],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findOne({
            where: {id},
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        if (updateUserDto.password) {
            updateUserDto.password = await this.cryptoService.hashPassword(updateUserDto.password);
        }

        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.userRepository.findOne({
                where: {email: updateUserDto.email},
            });

            if (existingUser) {
                throw new BadRequestException('Email already exists');
            }
        }

        await this.userRepository.update(id, updateUserDto);

        return this.findOne(id);
    }

    async remove(id: number) {
        const user = await this.userRepository.findOne({
            where: {id},
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        await this.userRepository.delete(id);

        return {message: `User with ID ${id} has been deleted`};
    }

    async findByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: {email},
        });

        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }

        return user;
    }

    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return this.cryptoService.passwordVerify(password, hashedPassword);
    }

    async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
        const user = await this.userRepository.findOne({
            where: {id: userId},
            relations: ['interests'],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        if (updateProfileDto.firstname) {
            user.firstname = updateProfileDto.firstname;
        }

        if (updateProfileDto.lastname) {
            user.lastname = updateProfileDto.lastname;
        }

        if (updateProfileDto.email && updateProfileDto.email !== user.email) {
            const existingUser = await this.userRepository.findOne({
                where: {email: updateProfileDto.email},
            });

            if (existingUser) {
                throw new BadRequestException('Email already exists');
            }

            user.email = updateProfileDto.email;
        }

        if (updateProfileDto.password) {
            user.password = await this.cryptoService.hashPassword(updateProfileDto.password);
        }

        if (updateProfileDto.interestIds && Array.isArray(updateProfileDto.interestIds)) {
            const interests = await this.interestRepository.find({
                where: {id: In(updateProfileDto.interestIds)},
            });

            if (interests.length !== updateProfileDto.interestIds.length) {
                throw new BadRequestException('One or more interests do not exist');
            }

            user.interests = interests;
        }

        await this.userRepository.save(user);

        return this.userRepository.findOne({
            where: {id: userId},
            relations: ['interests'],
            select: ['id', 'email', 'firstname', 'lastname', 'role', 'createdAt', 'updatedAt'],
        });
    }

}