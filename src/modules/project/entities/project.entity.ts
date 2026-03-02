import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../user/entities/user.entity";
import {Investment} from "../../investment/entities/investment.entity";

@Entity({ name: 'project' })
export class Project {
    @PrimaryGeneratedColumn()
    @ApiProperty({description: 'The unique identifier of the project', example: 1})
    id: number;

    @Column({ type: 'varchar' })
    @ApiProperty({description: 'The name of the project', example: 'E-commerce Platform'})
    name: string;

    @Column({ type: 'text' })
    @ApiProperty({description: 'The description of the project', example: 'An innovative e-commerce platform'})
    description: string;

    @Column({ type: 'varchar' })
    @ApiProperty({description: 'The budget of the project', example: 100000})
    budget: number;

    @Column({ type: 'varchar' })
    @ApiProperty({description: 'The category of the project', example: 'Technology'})
    category: string;

    @ManyToOne(() => User, (user) => user.projects)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    @ApiProperty({description: 'The ID of the project creator', example: 1})
    userId: number;

    @OneToMany(() => Investment, (investment) => investment.project)
    investments: Investment[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty({description: 'The creation date of the project', example: '2026-03-02T10:00:00Z'})
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    @ApiProperty({description: 'The last update date of the project', example: '2026-03-02T10:00:00Z'})
    updatedAt: Date;
}
