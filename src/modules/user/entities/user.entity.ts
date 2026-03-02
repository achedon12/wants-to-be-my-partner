import {Column, Entity, OneToMany, PrimaryGeneratedColumn,} from 'typeorm';
import {Project} from "../../project/entities/project.entity";

@Entity({name: 'user'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', unique: true})
    email: string;

    @Column({type: 'varchar'})
    password: string;

    @Column({type: 'varchar'})
    firstname: string;

    @Column({type: 'varchar'})
    lastname: string;

    @Column({type: 'varchar'})
    role: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @OneToMany(() => Project, (project) => project.user)
    projects: Project[];
}
