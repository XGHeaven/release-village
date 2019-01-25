import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Release } from '../type/release'
import { StorePlace } from '../type/store'

@Entity()
export class Record implements Release {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar', { length: 40 })
  user!: string

  @Column('varchar', { length: 100 })
  repo!: string

  @Column('varchar', { length: 100 })
  tag!: string

  @Column('varchar', { length: 255 })
  file!: string

  @Column('varchar', { length: 10 })
  store!: StorePlace

  @Column('varchar', { length: 512 })
  url!: string
}
