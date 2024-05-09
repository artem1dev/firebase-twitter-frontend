import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUser } from "./create-user.interface";

export class UpdateUser extends PartialType(OmitType(CreateUser, ["uid"] as const)) {}
