interface User {
  id?: number;
  authId: number;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
}

const initialUser: User = {
  id: undefined,
  authId: 0,
  firstName: "",
  lastName: "",
  createdAt: "",
  updatedAt: "",
};

const initialUserForm: UserForm = {
  firstName: "",
  lastName: "",
  email: "",
};

export type { User, UserForm };
export { initialUser, initialUserForm };
