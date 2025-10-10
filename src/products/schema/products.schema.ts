import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'ProductCategory', required: true })
  category: Types.ObjectId;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  details: string;

  @Prop({ required: false })
  image: string;

  @Prop({ required: false })
  cloudinaryImageId: string;

  @Prop({ type: Types.ObjectId, ref: 'Admin', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Admin', required: false })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Admin', required: false })
  deletedBy: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export type ProductDocument = Product & Document<Types.ObjectId>;
