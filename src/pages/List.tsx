import React, {useEffect, useState} from 'react';
import api from '../setup/api';
import Header from '../template/Header';
import PlaceFormModal from '../components/PlaceFormModal';
import {MarkerListType, ToastAlertType, ToastAlertTypeList} from "../setup/interfaces";
import {CustomOverlayMap, Map, MapMarker} from 'react-kakao-maps-sdk';
import {Box, Chip, IconButton, InputBase, Paper} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MarkerImg from '../assets/marker.png';
import MarkerActiveImg from '../assets/marker-active.png';
import ToastAlert from "../components/ToastAlert";

interface SelectMarkerListType extends MarkerListType {
	is_saved?: boolean
}

const List:React.FC = () => {
	const [markers, setMarkers] = useState<MarkerListType[]>([]);
	const [map, setMap] = useState<any>();
	const [input, setInput] = useState<string>('');
	const [selectMarker, setSelectMarker] = useState<MarkerListType | null>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [toast, setToast] = useState<ToastAlertType | null>(null);
	const ps = new kakao.maps.services.Places();

	useEffect(() => {
		if (map) renderMarkerList();
	}, [map]);


	// 검색어 input
	const searchKeyword = (event:React.ChangeEvent<HTMLInputElement>) => {
		setInput(event.target.value);
	}

	// 검색 enter
	const searchKeydown = (event:React.KeyboardEvent<HTMLInputElement>) => {
		if(event.key === 'Enter')
			search();
	}

	// 검색
	const search = () => {
		if (!map) return;

		ps.keywordSearch(input, async (data:any, status:any) => {
			if(status === kakao.maps.services.Status.OK) {
				const savedMarkers:MarkerListType[] = await selectMarkerList();
				const bounds = new kakao.maps.LatLngBounds();
				let markerArr = [];

				for (let i = 0; i < data.length; i++) {
					// 주소 중복 체크
					const isDuplicate = markerArr.some(item => item.addr === data[i].address_name);
					const isSaved = savedMarkers.some(item => item.idx === Number(data[i].id));

					if(isDuplicate) continue;

					markerArr.push({
						idx: Number(data[i].id),
						pos_lat:Number(data[i].y),
						pos_lng:Number(data[i].x),
						title: data[i].place_name,
						addr:data[i].address_name,
						is_saved: isSaved
					});

					bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
				}

				setMarkers(markerArr);
				map.setBounds(bounds)
			}
			// 검색 결과 없을 경우
			else if(status === 'ZERO_RESULT') {
				setToast(() => ({
					open: true,
					type: ToastAlertTypeList.WARNING,
					message: '검색 결과가 없습니다.',
					onClose: () => setToast((prev) => (prev ? { ...prev, open: false } : null)),
				}));
			}
		})
	}

	// 저장된 마커 조회
	const selectMarkerList = async (idx?:MarkerListType['idx']) : Promise<MarkerListType[]> => {
		const response = await api.get<{message: string, data:MarkerListType[]}>('/place', {params: idx ? {idx: idx} : ''});
		return response.data.data;
	}


	// 저장된 마커 렌더
	const renderMarkerList = () => {
		if (!map) return;

		const bounds = new kakao.maps.LatLngBounds();
		let markerArr:SelectMarkerListType[] = [];

		selectMarkerList().then((res) => {
			if(res.length > 0) {
				res.forEach(item => {
					markerArr.push({
						idx: Number(item.idx),
						pos_lat:Number(item.pos_lat),
						pos_lng:Number(item.pos_lng),
						title: item.title,
						addr:item.addr,
						is_saved: true
					});
					bounds.extend(new kakao.maps.LatLng(item.pos_lat, item.pos_lng))
				});

				setMarkers(markerArr);
				map.setBounds(bounds);
			}
		});
	}


	// 마커 click
	const selectMarkerOpen = (data:MarkerListType) => {
		setOpen(true);
		setSelectMarker(data);
		selectMarkerList(data.idx).then((res) => {
			if(res.length > 0) {
				setSelectMarker({...data, memo: res[0].memo, date: res[0].date, rating: res[0].rating, reg_date: res[0].reg_date, mod_date: res[0].mod_date});
			}
		});
	}


	// 마커 close
	const selectMarkerClose = () => {
		setOpen(false);
		setSelectMarker(null);
	}


	// 마커 저장
	const saveMarker = async (data:Partial<MarkerListType>) : Promise<MarkerListType> => {
		if(!data.idx) throw new Error('idx가 없습니다.');

		const res = await selectMarkerList(data.idx);
		const response = res.length > 0 ? await api.patch<MarkerListType>('/place', data) :  await api.post<MarkerListType>('/place', data);

		renderMarkerList();
		setOpen(false);
		setToast(() => ({
			open: true,
			type: ToastAlertTypeList.SUCCESS,
			message: '장소를 저장했습니다.',
			onClose: () => setToast((prev) => (prev ? { ...prev, open: false } : null)),
		}));

		return response.data;
	}

	// 마커 삭제
	const deleteMaker = async (idx:MarkerListType['idx']) : Promise<MarkerListType> =>  {
		const response = await api.delete<MarkerListType>('/place', {params: {idx}});

		renderMarkerList();
		setOpen(false);
		setToast(() => ({
			open: true,
			type: ToastAlertTypeList.SUCCESS,
			message: '장소를 삭제했습니다.',
			onClose: () => setToast((prev) => (prev ? { ...prev, open: false } : null)),
		}));

		return response.data;
	}


	return (
		<>
			<Box
				component="section"
				sx={{height:"100vh", display:"flex", flexDirection:"column"}}
			>

				<Header/>

				<Box component="div" sx={{pl:2, pr:2, pb:2, position:"relative"}}>
					<Paper
						component="div"
						variant="outlined"
						sx={{display: "flex", alignItems: "center", width: "100%"}}
					>
						<InputBase
							sx={{pl:2, pr:2, flex: 1}}
							placeholder="키워드/장소를 입력해주세요."
							onInput={searchKeyword}
							onKeyDown={searchKeydown}
						/>
						<IconButton
							type="button" sx={{p: 1}}
							aria-label="검색하기"
							onClick={search}
						>
							<SearchIcon />
						</IconButton>
					</Paper>
				</Box>
				<Map
					center={{lat: 33.5563, lng: 126.79581}}
					style={{width: "100%", height: "100%"}}
					onCreate={setMap}
				>
					{
						markers.map((marker:SelectMarkerListType) => (
							<div key={marker.idx}>
								<MapMarker
									position={{lat: marker.pos_lat, lng: marker.pos_lng}}
									image={{src: marker.is_saved ? MarkerActiveImg : MarkerImg, size: {width:24, height:31}}}
									clickable={true}
									onClick={() => selectMarkerOpen(marker)}
								>
								</MapMarker>
								<CustomOverlayMap
									position={{lat: marker.pos_lat, lng: marker.pos_lng}}
									yAnchor={2.4}
								>
									<Chip
										color="default"
										size="small"
										label={marker.title}
										sx={marker.is_saved ? {background:"#3d6cb3", color:"#fff", border:"1px solid #000", fontSize:14} : {background:"#fff", color:"#111", border:"1px solid #000", fontSize:14}}
									/>
								</CustomOverlayMap>
							</div>
						))
					}
				</Map>
			</Box>

			{/* 팝업 :: 장소 등록 */}
			<PlaceFormModal open={open} onClose={selectMarkerClose} onConfirm={saveMarker} info={selectMarker} onDelete={deleteMaker}/>


			{/* 알림 :: 토스트 */}
			{ toast && toast.open ? <ToastAlert open={toast.open} type={toast.type} message={toast.message}  onClose={toast.onClose} /> : '' }
		</>
	)
}


export default List;