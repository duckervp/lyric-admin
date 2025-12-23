import { API } from '../endpoints';
import { apiSlice } from '../apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    changeName: builder.mutation({
      query: (payload) => ({
        url: `${API.song}/update-name`,
        method: 'PATCH',
        body: { ...payload },
      }),
      invalidatesTags: ['Song'],
    }),
    updateAvatar: builder.mutation({
      query: (payload) => ({
        url: `${API.song}/update-avatar`,
        method: 'PATCH',
        body: { ...payload },
      }),
      invalidatesTags: ['Song'],
    }),
    getAllSongs: builder.query({
      query: (params) => ({
        url: API.song,
        method: "GET",
        params
      }),
      providesTags: ['Song'],
    }),
    getSongById: builder.query({
      query: (id) => ({
        url: `${API.song}/${id}`,
        method: "GET"
      }),
    }),
    getSongDetail: builder.mutation({
      query: (id) => ({
        url: `${API.song}/${id}`,
        method: "GET"
      }),
    }),
    createSong: builder.mutation({
      query: (payload) => ({
        url: `${API.song}`,
        method: "POST",
        body: { ...payload },
      }),
      invalidatesTags: ['Song'],
    }),
    deleteSong: builder.mutation({
      query: (id) => ({
        url: `${API.song}/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Song'],
    }),
    updateSong: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${API.song}/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ['Song'],
    }),
    deleteSongs: builder.mutation({
      query: (ids) => ({
        url: `${API.song}/${ids.join()}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Song'],
    }),
  }),
});

export const {
  useChangeNameMutation,
  useUpdateAvatarMutation,
  useGetAllSongsQuery,
  useGetSongByIdQuery,
  useGetSongDetailMutation,
  useCreateSongMutation,
  useDeleteSongMutation,
  useUpdateSongMutation,
  useDeleteSongsMutation
} = authApiSlice;
