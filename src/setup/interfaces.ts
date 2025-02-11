export interface MarkerListType {
	idx: number,
	position: {
		lat: number,
		lng: number
	},
	content: string,
	addrName: string,
	date?: string | null,
	memo?: string | null,
	rating?: number | null
}