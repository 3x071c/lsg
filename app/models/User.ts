/* eslint-disable @typescript-eslint/no-redeclare -- Zod inferred typings */
import type { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { UserModel } from "~db";

/* todo better type checking */
export const User = UserModel;
export type User = z.infer<typeof User>;

export const UserData = User.omit({
	createdAt: true,
	updatedAt: true,
	uuid: true,
});

export const UserValidatorData = UserData.omit({
	canAccessCMS: true,
	canAccessLab: true,
	canAccessSchoolib: true,
	did: true,
	email: true,
	locked: true,
});
export const UserValidator = withZod(UserValidatorData);
