export interface ResetPassword {
	email?: string;
	token?: string;
	password?: string;
	password_confirmation?: string;
}

export interface Forgot {
    email?: string;
}