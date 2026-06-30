import { Colors } from "src/colors/entity/colors.entity";
import { Size } from "src/size/entity/size.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "src/category/entity/category.entity";

@Entity()
export class Products {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar' })
    name?: string;

    @Column({ type: 'text' })
    description?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;


    @ManyToOne(() => Category, (category) => category.products)
    category?: Category;

    @ManyToMany(() => Colors, (colors) => colors.products)
    @JoinTable()
    colors?: Colors[];

    @ManyToOne(() => Size, (size) => size.products)
    size?: Size;


    @Column({ type: 'text' })
    image?: string;

    @Column({ type: 'boolean', default: true })
    is_use?: boolean;

    @Column({ type: 'boolean', default: false })
    is_popular?: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}