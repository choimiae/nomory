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