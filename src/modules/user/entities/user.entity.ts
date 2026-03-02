import {Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {Project} from "../../project/entities/project.entity";
import {Interest} from "../../interest/entities/interest.entity";
import {Investment} from "../../investment/entities/investment.entity";

@Entity({name: 'user'})
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty({description: 'The unique identifier of the user', example: 1})
    id: number;

    @Column({type: 'varchar', unique: true})
    @ApiProperty({description: 'The email of the user', example: 'user@example.com'})
    email: string;

    @Column({type: 'varchar'})
    @ApiProperty({description: 'The hashed password of the user', example: 'hashed_password_here'})
    password: string;

    @Column({type: 'varchar'})
    @ApiProperty({description: 'The first name of the user', example: 'Jean'})
    firstname: string;

    @Column({type: 'varchar'})
    @ApiProperty({description: 'The last name of the user', example: 'Dupont'})
    lastname: string;

    @Column({type: 'varchar'})
    @ApiProperty({description: 'The role of the user', example: 'Entrepreneur', enum: ['Entrepreneur', 'Investisseur', 'Admin']})
    role: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    @ApiProperty({description: 'The creation date of the user', example: '2026-03-02T10:00:00Z'})
    createdAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    @ApiProperty({description: 'The last update date of the user', example: '2026-03-02T10:00:00Z'})
    updatedAt: Date;

    @OneToMany(() => Project, (project) => project.user)
    projects: Project[];

    @OneToMany(() => Investment, (investment) => investment.investor)
    investments: Investment[];

    @ManyToMany(() => Interest)
    @JoinTable({
        name: 'user_interest',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'interest_id', referencedColumnName: 'id' },
    })
    interests: Interest[];
}
