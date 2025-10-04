import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, UserRoleEnum } from "../types/user.types";

interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    roles: {
      type: [String],
      enum: Object.values(UserRoleEnum),
      default: [UserRoleEnum.PASSENGER],
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshTokens: {
      type: [
        {
          token: String,
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = model<IUserDocument>("User", userSchema);
