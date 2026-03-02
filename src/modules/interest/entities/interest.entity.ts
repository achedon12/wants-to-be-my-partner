import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: 'interest'})
export class Interest {
    @PrimaryGeneratedColumn()
    @ApiProperty({description: 'The unique identifier of the interest', example: 1})
    id: number;

    @Column({type: 'varchar', unique: true})
    @ApiProperty({description: 'The name of the interest', example: 'Technology'})
    name: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    @ApiProperty({description: 'The creation date of the interest', example: '2026-03-02T10:00:00Z'})
    createdAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    @ApiProperty({description: 'The last update date of the interest', example: '2026-03-02T10:00:00Z'})
    updatedAt: Date;
}
