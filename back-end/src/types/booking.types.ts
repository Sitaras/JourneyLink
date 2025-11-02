import { Types } from "mongoose";

export interface IBooking {
    passenger: Types.ObjectId;
    driver: Types.ObjectId;
    route: Types.ObjectId;
    status: "pending" | "confirmed" | "cancelled";
    createdAt?: Date;
    updatedAt?: Date;
}