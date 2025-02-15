export interface MarkerListType {
	idx: number,
	position: {
		lat: number,
		lng: number
	},
	content: string,
	addr: string,
	date?: string | null,
	memo?: string | null,
	rating?: number | null,
	reg_date?: string | null
	mod_date?: string | null
}