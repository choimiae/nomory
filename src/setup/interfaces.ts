export interface MarkerListType {
	position: {
		lat: number,
		lng: number
	},
	content: string,
	addrName: string,
	date?: string | null,
	memo?: string | null,
}