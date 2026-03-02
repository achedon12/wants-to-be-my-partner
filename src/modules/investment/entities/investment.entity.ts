import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import { User } from '../../user/entities/user.entity';
import { Project } from '../../project/entities/project.entity';

@Entity({ name: 'investment' })
export class Investment {
  @PrimaryGeneratedColumn()
  @ApiProperty({description: 'The unique identifier of the investment', example: 1})
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({description: 'The amount invested in the project', example: 50000})
  amount: number;

  @ManyToOne(() => User, (user) => user.investments)
  @JoinColumn({ name: 'investorId' })
  investor: User;

  @Column()
  @ApiProperty({description: 'The ID of the investor', example: 1})
  investorId: number;

  @ManyToOne(() => Project, (project) => project.investments)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  @ApiProperty({description: 'The ID of the project', example: 1})
  projectId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({description: 'The creation date of the investment', example: '2026-03-02T10:00:00Z'})
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @ApiProperty({description: 'The last update date of the investment', example: '2026-03-02T10:00:00Z'})
  updatedAt: Date;
}

