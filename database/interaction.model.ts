
import { Schema, models, model, Types, Document } from "mongoose";

import { InteractionActionEnums } from "@/constants/interactions";
import type { InteractionAction } from "@/constants/interactions";

export { InteractionActionEnums } from "@/constants/interactions";
export type { InteractionAction } from "@/constants/interactions";

export interface IInteraction {
  user: Types.ObjectId;
  action: InteractionAction;
  actionId: Types.ObjectId;
  actionType: "question" | "answer";
}

export interface IInteractionDoc extends IInteraction, Document {}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: InteractionActionEnums,
      required: true,
    },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, enum: ["question", "answer"], required: true },
  },
  { timestamps: true }
);

 const Interaction =
   models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

 export default Interaction;
