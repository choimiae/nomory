export interface MarkerListType {
	idx: number;
	pos_lat: number;
	pos_lng: number;
	title: string;
	addr: string;
	date?: string | null;
	memo?: string | null;
	rating?: number | null;
	reg_date?: string | null;
	mod_date?: string | null;
}

export enum UserInfoList {
	ID = 'id',
	PW = 'password',
	PW_CONFIRM = 'password_confirm',
	NICKNAME = 'nickname'
}

export interface UserInfoType {
	[UserInfoList.ID] : string;
	[UserInfoList.PW] : string;
	[UserInfoList.NICKNAME] :string;
}