import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Email } from "../../@types/data";
import { RootState } from "../store";

export const emailApi = createApi({
  reducerPath: "emailApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access_token;
      headers.set("Authorization", `Bearer ${token ?? ""}`);
      return headers;
    },
  }),
  tagTypes: ["Email"],
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getEmailReceived: builder.query<Email[], void>({
      query: () => ({
        url: `email`,
        async responseHandler(response) {
          const data = await response.json();
          if (data.error != null) {
            return null;
          }
          return data.data;
        },
      }),
      providesTags: ["Email"],
    }),
    getEmailSent: builder.query<Email[], void>({
      query: () => ({
        url: `email/sent`,
        async responseHandler(response) {
          const data = await response.json();
          if (data.error != null) {
            return null;
          }
          return data.data;
        },
      }),
      providesTags: (result) =>
        result ? result.map(({ id }) => ({ type: "Email", id })) : [],
    }),
    getEmailArchived: builder.query<Email[], void>({
      query: () => ({
        url: `email/deleted`,
        async responseHandler(response) {
          const data = await response.json();
          if (data.error != null) {
            return null;
          }
          return data.data;
        },
      }),
      providesTags: (result) =>
        result ? result.map(({ id }) => ({ type: "Email", id })) : [],
    }),
    readEmail: builder.mutation<Email, number>({
      invalidatesTags: ["Email"],
      query: (id) => `read/${id}`,
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const data: any = await queryFulfilled;
        if (data.data && !data.data.error) {
          dispatch(
            emailApi.util.updateQueryData("getEmailReceived", undefined, (draft) => {
              return draft.filter((e) => e.id !== id);
            })
          );
          dispatch(
            emailApi.util.updateQueryData("getEmailSent", undefined, (draft) => {
              return draft.filter((e) => e.id !== id);
            })
          );
        }
      },
    }),
    deleteEmail: builder.mutation<Email, number>({
      query: (id) => `delete/${id}`,
      invalidatesTags: ["Email"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const data: any = await queryFulfilled;
        if (data.data && !data.data.error) {
          dispatch(
            emailApi.util.updateQueryData("getEmailReceived", undefined, (draft) => {
              return draft.filter((e) => e.id !== id);
            })
          );
          dispatch(
            emailApi.util.updateQueryData("getEmailSent", undefined, (draft) => {
              return draft.filter((e) => e.id !== id);
            })
          );
          dispatch(
            emailApi.util.updateQueryData("getEmailArchived", undefined, (draft) => {
              return draft;
            })
          );
        }
      },
    }),
  }),
});

export const {
  useGetEmailReceivedQuery,
  useDeleteEmailMutation,
  useGetEmailSentQuery,
  useReadEmailMutation,
  useGetEmailArchivedQuery,
  useLazyGetEmailReceivedQuery,
  useLazyGetEmailArchivedQuery,
  useLazyGetEmailSentQuery,
} = emailApi;
