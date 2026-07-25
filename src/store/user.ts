import { defineStore } from "pinia";
import { reactive } from "vue";
import { useApiResult } from "@/composables/useApiResult";
import { initialUser, type User } from "@/entities/user";
import { mapperUser, userToJson } from "@/helpers/mappers/user";
import { apiAuth } from "@/services/api";
import useAuthStore from "./auth";

const useUserStore = defineStore("user", () => {
  const { exec, loading } = useApiResult();
  const authStore = useAuthStore();
  const userData = reactive<User>(structuredClone(initialUser));

  const getUser = async () => {
    return await exec(() => apiAuth.get("/user/me"), {
      mapper(res) {
        const extractedData = res.data.data ?? null;
        if (!extractedData) {
          throw new Error(
            "Error al obtener el usuario. Por favor, intenta de nuevo.",
          );
        }

        return mapperUser(extractedData);
      },
      onSuccess: (data) => {
        Object.assign(userData, structuredClone(data));
      },
      onError: (_) => {},
    });
  };

  const addUser = async () => {
    return await exec(() => apiAuth.post("/user", userToJson(userData)), {
      mapper(res) {
        const extractedData = res.data.data ?? null;
        if (!extractedData) {
          throw new Error(
            "Error al iniciar sesión. Por favor, intenta de nuevo.",
          );
        }
        return mapperUser(extractedData);
      },
      onSuccess: (data) => {
        Object.assign(userData, data);
        authStore.getSession();
      },
      onError: (_) => {},
    });
  };

  const updateUser = async () => {
    return await exec(
      () =>
        apiAuth.put("/user/me", {
          first_name: userData.firstName,
          last_name: userData.lastName,
        }),
      {
        mapper(res) {
          const extractedData = res.data.message ?? "";
          if (!extractedData) {
            throw new Error(
              "Error al actualizar el usuario. Por favor, intenta de nuevo.",
            );
          }
          return extractedData;
        },
        onSuccess: () => {
          getUser();
        },
        onError: (_) => {},
      },
    );
  };

  return {
    userData,
    loading,
    getUser,
    addUser,
    updateUser,
  };
});

export default useUserStore;
