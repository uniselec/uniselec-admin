import { apiSlice } from '../api/apiSlice';
import { logOut, setCredentials } from './authSlice';
import { Forgot, ResetPassword } from '../../types/ResetPassword';
import { Admin } from '../../types/Admin';

const apiUrl = import.meta.env.VITE_API_URL;

export type Credentials = {
	email: string;
	password: string;
	device_name: string;
};

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation({
			query: (credentials: Credentials) => ({
				url: `${apiUrl}/api/admin/login`,
				method: 'POST',
				body: { ...credentials },
			}),
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					const response = await queryFulfilled;
					dispatch(setCredentials(response.data));
				} catch (error) {
					console.log(error);
				}
			},
		}),
		resetPassword: builder.mutation({
			query: (passwordResetData: ResetPassword) => ({
				url: `${apiUrl}/api/admin/password/reset`,
				method: 'POST',
				body: { ...passwordResetData },
			})
		}),
		passwordForgot: builder.mutation({
			query: (passwordForgot: Forgot) => ({
				url: `${apiUrl}/api/admin/password/forgot`,
				method: 'POST',
				body: { ...passwordForgot },
			})
		}),
		sendLogOut: builder.mutation({
			query: () => ({
				url: `${apiUrl}/api/logout`,
				method: 'POST',
			}),
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(logOut());
					dispatch(apiSlice.util.resetApiState());
				} catch (error) {
					console.log(error);
				}
			},
		}),
		updateProfile: builder.mutation({
			query: (updatedData: Partial<Admin>) => ({
				url: '/profile',
				method: 'PUT',
				body: { ...updatedData }
			}),
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					const response = await queryFulfilled;
					dispatch(setCredentials(response.data));
				} catch (error) {
					console.log(error);
				}
			}
		}),
	}),
});

export const {
	useLoginMutation,
	useSendLogOutMutation,
	useResetPasswordMutation,
	usePasswordForgotMutation,
	useUpdateProfileMutation // Exporta a nova mutation
} = authApiSlice;
