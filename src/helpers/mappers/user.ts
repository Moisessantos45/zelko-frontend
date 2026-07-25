import type { User } from "@/entities/user";
import { getDateToString, getNumber, getString } from "./formatters";

const mapperUser = (data: Record<string, unknown>): User => {
  return {
    id: getNumber(data.id),
    firstName: getString(data.first_name),
    lastName: getString(data.last_name),
    authId: getNumber(data.auth_id),
    createdAt: getDateToString(data.created_at),
    updatedAt: getDateToString(data.updated_at),
  };
};

const mapperUserBasicInfo = (data: Record<string, unknown>) => {
  return {
    id: getNumber(data.id),
    firstName: getString(data.first_name),
    lastName: getString(data.last_name),
    avatarUrl: getString(data.avatar_url),
    phone: getString(data.phone),
  };
};

const mapperUserListItem = (data: Record<string, unknown>) => {
  return {
    id: getNumber(data.id),
    firstName: getString(data.first_name),
    lastName: getString(data.last_name),
    email: getString(data.email),
    active: getNumber(data.active) === 1,
  };
};

const userToJson = (user: Partial<User>) => ({
  first_name: user.firstName,
  last_name: user.lastName,
});

export { mapperUserBasicInfo, mapperUserListItem, mapperUser, userToJson };
