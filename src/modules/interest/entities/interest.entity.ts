import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'interest'})
export class Interest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', unique: true})
    name: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
}
