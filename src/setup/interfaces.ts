export interface MarkerListType {
	idx: number,
	pos_lat: number,
	pos_lng: number,
	title: string,
	addr: string,
	date?: string | null,
	memo?: string | null,
	rating?: number | null,
	reg_date?: string | null,
	mod_date?: string | null
}

export enum ToastAlertTypeList {
	SUCCESS = 'success',
	ERROR = 'error',
	WARNING = 'warning',
	INFO = 'info'
}

export interface ToastAlertType {
	open: boolean,
	type: ToastAlertTypeList,
	message: string,
	onClose: () => void
}