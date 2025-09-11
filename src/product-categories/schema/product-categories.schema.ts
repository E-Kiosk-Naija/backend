import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class ProductCategory {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: false })
  description: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, required: false, default: null })
  deletedAt: Date | null;

  @Prop({ type: Date, required: false, default: null })
  updatedAt: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'Admin', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Admin', required: false })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Admin', required: false })
  deletedBy: Types.ObjectId | null;
}

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
export type ProductCategoryDocument = ProductCategory &
  Document<Types.ObjectId>;
