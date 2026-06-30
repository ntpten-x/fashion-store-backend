import { Category } from "src/category/entity/category.entity";
import { Products } from "src/products/entity/products.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, JoinTable, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Size {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: 'varchar' })
    size_name: string;


    @ManyToMany(() => Category)
    @JoinTable()
    use?: Category[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => Products, (products) => products.size)
    products?: Products[];
}