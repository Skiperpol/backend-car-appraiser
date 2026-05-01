import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Order' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255, nullable: true })
  orderNumber?: string;

  @Column({ length: 255, nullable: true })
  externalNumber?: string;

  @Column({ length: 255, nullable: true })
  caseSignature?: string;

  @Column({ type: 'timestamp', nullable: true })
  damageDate?: Date;

  @Column({ type: 'timestamp' })
  createdAt!: Date;

  @Column({ type: 'timestamp' })
  updatedAt!: Date;

  @Column({ nullable: true })
  vehicleId?: number;

  @Column({ nullable: true })
  clientId?: number;

  @Column({ nullable: true })
  expertId?: number;
}

@Entity({ name: 'Party' })
export class PartyEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255, nullable: true })
  firstName?: string;

  @Column({ length: 255, nullable: true })
  lastName?: string;

  @Column({ length: 255, nullable: true })
  phone?: string;

  @Column({ length: 255, nullable: true })
  email?: string;

  @Column()
  isExpert!: boolean;
}

@Entity({ name: 'Vehicle' })
export class VehicleEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255, nullable: true })
  brand?: string;

  @Column({ length: 255, nullable: true })
  model?: string;

  @Column({ length: 255, nullable: true })
  licensePlate?: string;

  @Column({ length: 255, nullable: true })
  vin?: string;
}

@Entity({ name: 'OrderStatuses' })
export class OrderStatusEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  technicalName!: string;

  @Column({ length: 255 })
  displayName!: string;
}

@Entity({ name: 'OrdersAssignedUsers' })
export class OrdersAssignedUsersEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  orderStatusId!: number;

  @Column()
  orderId!: number;

  @Column()
  userId!: number;

  @Column({ type: 'timestamp' })
  assignedAt!: Date;
}

@Entity({ name: 'OrderChangeLogs' })
export class OrderChangeLogEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'order_id' })
  orderId!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'changed_at', type: 'timestamp' })
  changedAt!: Date;

  @Column({ length: 255, nullable: true })
  description?: string;
}

export const ordersEntities = [
  OrderEntity,
  PartyEntity,
  VehicleEntity,
  OrderStatusEntity,
  OrdersAssignedUsersEntity,
  OrderChangeLogEntity,
];
