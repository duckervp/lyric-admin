import { API } from '../endpoints';
import { apiSlice } from '../apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    changeName: builder.mutation({
      query: (payload) => ({
        url: `${API.artist}/update-name`,
        method: 'PATCH',
        body: { ...payload },
      }),
      invalidatesTags: ['Artist'],
    }),
    updateAvatar: builder.mutation({
      query: (payload) => ({
        url: `${API.artist}/update-avatar`,
        method: 'PATCH',
        body: { ...payload },
      }),
      invalidatesTags: ['Artist'],
    }),
    getAllArtists: builder.query({
      query: (params) => ({
        url: API.artist,
        method: "GET",
        params
      }),
      providesTags: ['Artist'],
    }),
    getArtistById: builder.query({
      query: (id) => ({
        url: `${API.artist}/${id}`,
        method: "GET"
      }),
    }),
    getArtistDetail: builder.mutation({
      query: (id) => ({
        url: `${API.artist}/${id}`,
        method: "GET"
      }),
    }),
    createArtist: builder.mutation({
      query: (payload) => ({
        url: `${API.artist}`,
        method: "POST",
        body: { ...payload },
      }),
      invalidatesTags: ['Artist'],
    }),
    deleteArtist: builder.mutation({
      query: (id) => ({
        url: `${API.artist}/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Artist'],
    }),
    updateArtist: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${API.artist}/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ['Artist'],
    }),
    deleteArtists: builder.mutation({
      query: (ids) => ({
        url: `${API.artist}/${ids.join()}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Artist'],
    }),
  }),
});

export const {
  useChangeNameMutation,
  useUpdateAvatarMutation,
  useGetAllArtistsQuery,
  useGetArtistByIdQuery,
  useGetArtistDetailMutation,
  useCreateArtistMutation,
  useDeleteArtistMutation,
  useUpdateArtistMutation,
  useDeleteArtistsMutation
} = authApiSlice;
