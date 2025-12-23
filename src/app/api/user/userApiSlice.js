import { API } from '../endpoints';
import { apiSlice } from '../apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => ({
        url: API.user,
        method: "GET",
        params
      }),
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `${API.user}/${id}`,
        method: "GET"
      }),
    }),
    getUserDetail: builder.mutation({
      query: (id) => ({
        url: `${API.user}/${id}`,
        method: "GET"
      }),
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: `${API.user}`,
        method: "POST",
        body: { ...payload },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${API.user}/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${API.user}/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUsers: builder.mutation({
      query: (ids) => ({
        url: `${API.user}/${ids.join()}`,
        method: "DELETE"
      }),
      invalidatesTags: ['User'],
    }),
    updateUserProfile: builder.mutation({
      query: ({id, payload}) => ({
        url: `${API.user}/${id}/profile`,
        method: 'PATCH',
        body: { ...payload },
      }),
      invalidatesTags: ['User'],
    }),
    updateUserPassword: builder.mutation({
      query: ({id, payload}) => ({
        url: `${API.user}/${id}/password`,
        method: 'PATCH',
        body: { ...payload },
      }),
      invalidatesTags: ['User'],
    }),
    inactiveUserAccount: builder.mutation({
      query: (id) => ({
        url: `${API.user}/${id}/inactive`,
        method: 'PATCH'
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetUserDetailMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useDeleteUsersMutation,
  useUpdateUserProfileMutation,
  useUpdateUserPasswordMutation,
  useInactiveUserAccountMutation
} = authApiSlice;
