import { Category } from "src/category/entity/category.entity";
import { Products } from "src/products/entity/products.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, JoinTable, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Colors {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        type: "varchar"
    })
    colors_name?: string

    @Column({
        type: "varchar"
    })
    colors_code?: string

    @ManyToMany(() => Category)
    @JoinTable()
    use?: Category[];

    @CreateDateColumn({
        type: "timestamp"
    })
    createdAt!: Date

    @UpdateDateColumn({
        type: "timestamp"
    })
    updatedAt!: Date

    @ManyToMany(() => Products, (products) => products.colors)
    products?: Products[];
}