import {BaseSchema} from "./base.schema";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Schema as MongooseSchema} from "mongoose";
import {ClientUserDocument} from "./client-user.schema";
import {UserDocument} from "./user.schema";
import {ConversationDocument} from "./conversation.schema";
import {Exclude, Expose} from "class-transformer";

export type MessageDocument = Document & Message;

export enum MessageTypes {
    TEXT,
    CALL_START,
    CALL_END,
    CALL_UNANSWERED
}

@Exclude()
@Schema({
    id: true,
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})
export class Message extends BaseSchema
{
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    })
    conversation: ConversationDocument;

    @Expose()
    @Prop({
        type: MongooseSchema.Types.String,
        required: true,
        maxlength: 1000,
    })
    text: string;

    @Expose()
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    author: UserDocument;

    @Expose()
    @Prop({
        type: MongooseSchema.Types.Number,
        enum: MessageTypes,
        default: MessageTypes.TEXT
    })
    type: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);