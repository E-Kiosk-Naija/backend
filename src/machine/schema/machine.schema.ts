// src/modules/machines/schemas/machine.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MachineStatus } from './enums/machine-status.enum';

export type MachineDocument = Machine & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Machine {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  machineCode: string;

  @Prop()
  description: string;

  @Prop()
  location: string;

  @Prop({ type: Number })
  lat: number;

  @Prop({ type: Number })
  lng: number;

  @Prop({ type: String, enum: MachineStatus, default: MachineStatus.ACTIVE })
  status: MachineStatus;

  @Prop({ type: Types.ObjectId, ref: 'Admin', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  deletedBy: Types.ObjectId;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);
