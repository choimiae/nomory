export interface MarkerListType {
	idx: number;
	pos_lat: number;
	pos_lng: number;
	title: string;
	addr: string;
	folder_idx?: number | null;
	date?: string | null;
	memo?: string | null;
	rating?: number | null;
	reg_date?: string | null;
	mod_date?: string | null;
}

export interface FolderListType {
	idx: string,
	title:string,
	color:string
}

export type FolderGroupType = {
	[key : string] : FolderListType
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