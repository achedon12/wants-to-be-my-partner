import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import {User} from "../../user/entities/user.entity";

@Entity({ name: 'project' })
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'varchar' })
    budget: number;

    @Column({ type: 'varchar' })
    category: string;

    @ManyToOne(() => User, (user) => user.projects)
    @JoinColumn({ name: 'userId' })
    user: User;

    userId: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
