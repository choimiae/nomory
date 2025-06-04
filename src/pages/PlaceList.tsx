import React, {useEffect, useMemo, useState} from 'react';
import api from '../setup/api';
import Layout from '../template/Layout';
import PlaceFormModal from '../components/PlaceFormModal';
import {FolderItemType, MarkerListType} from '../setup/interfaces';
import {CustomOverlayMap, Map, MapMarker} from 'react-kakao-maps-sdk';
import {Box, Chip, IconButton, InputBase, Paper} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MarkerImg from '../assets/marker.png';
import {ToastAlert, ToastAlertType} from '../components/ToastAlert';
import ReplayIcon from '@mui/icons-material/Replay';

type SelectMarkerListType = MarkerListType & {
	is_saved?: boolean
}

const PlaceList:React.FC = () => {
	const [markers, setMarkers] = useState<MarkerListType[]>([]);
	const [map, setMap] = useState<any>();
	const [input, setInput] = useState<string>('');
	const [selectMarker, setSelectMarker] = useState<MarkerListType | null>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [toast, setToast] = useState<ToastAlertType | null>(null);
	const [folderList, setFolderList] = useState<FolderItemType[] | null>(null);
	const ps = new kakao.maps.services.Places();

	// 폴더 조회
	const selectFolder = async ()  => {
		const response = await api.get<{message: string, data:FolderItemType[]}>('/folder');
		return response.data.data;
	}

	useEffect(() => {
		if (map)
			refreshMarkerList();

		selectFolder().then(res => {
			setFolderList(res);
		});
	}, [map]);

	// 폴더 색상 조회
	const folderColorMap = useMemo(() => {
		const map : {[key : number] : string} = {};

		folderList?.forEach(folder => {
			map[folder.idx] = folder.color;
		})

		return map;
	}, [folderList]);

	// 검색어 입력
	const searchKeyword = (event:React.ChangeEvent<HTMLInputElement>) => {
		setInput(event.target.value);
	}

	// 검색 엔터
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
					const matchMarker = savedMarkers.find(item => item.idx === Number(data[i].id));

					if(isDuplicate) continue;

					markerArr.push({
						idx: Number(data[i].id),
						pos_lat:Number(data[i].y),
						pos_lng:Number(data[i].x),
						title: data[i].place_name,
						addr:data[i].address_name,
						is_saved: !!matchMarker,
						folder_idx: !!matchMarker ? matchMarker.folder_idx : null
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
					type: 'warning',
					message: '검색 결과가 없습니다.',
					onClose: () => setToast((prev) => (prev ? { ...prev, open: false } : null)),
				}));
			}
		})
	}

	// 마커 목록 조회
	const selectMarkerList = async (idx?:MarkerListType['idx']) : Promise<MarkerListType[]> => {
		const response = await api.get<{message: string, data:MarkerListType[]}>('/place', {params: idx ? {idx: idx} : ''});
		return response.data.data;
	}

	// 마커 렌더
	const refreshMarkerList = () => {
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
						is_saved: true,
						folder_idx: item.folder_idx
					});
					bounds.extend(new kakao.maps.LatLng(item.pos_lat, item.pos_lng))
				});

				setMarkers(markerArr);
				map.setBounds(bounds);
			} else {
				bounds.extend(new kakao.maps.LatLng(37.881377, 127.729746))
				map.setBounds(bounds);
			}
		});
	}


	// 마커 클릭
	const selectMarkerOpen = (data:MarkerListType) => {
		setOpen(true);
		setSelectMarker(data);
		selectMarkerList(data.idx).then((res) => {
			if(res.length > 0) {
				setSelectMarker({...data, folder_idx:res[0].folder_idx, memo: res[0].memo, date: res[0].date, rating: res[0].rating, reg_date: res[0].reg_date, mod_date: res[0].mod_date});
			}
		});
	}


	// 마커 닫기
	const selectMarkerClose = () => {
		setOpen(false);
		setSelectMarker(null);
	}


	// 마커 저장
	const saveMarker = async (data:Partial<MarkerListType>) : Promise<MarkerListType> => {
		if(!data.idx) throw new Error('idx가 없습니다.');

		const res = await selectMarkerList(data.idx);
		const response = res.length > 0 ? await api.patch<MarkerListType>('/place', data) :  await api.post<MarkerListType>('/place', data);

		refreshMarkerList();
		setOpen(false);
		setToast(() => ({
			open: true,
			type: 'success',
			message: '장소를 저장했습니다.',
			onClose: () => setToast((prev) => (prev ? { ...prev, open: false } : null)),
		}));

		return response.data;
	}

	// 마커 삭제
	const deleteMaker = async (idx:MarkerListType['idx']) : Promise<MarkerListType> =>  {
		const response = await api.delete<MarkerListType>('/place', {params: {idx}});

		refreshMarkerList();
		setOpen(false);
		setToast(() => ({
			open: true,
			type: 'success',
			message: '장소를 삭제했습니다.',
			onClose: () => setToast((prev) => (prev ? { ...prev, open: false } : null)),
		}));

		return response.data;
	}

	const MarkerChip: React.FC<{marker:SelectMarkerListType, folderColorMap: {[key:number]: string}}> = React.memo(({marker, folderColorMap}) => {
		const color = marker.is_saved ? (marker.folder_idx ? folderColorMap[marker.folder_idx] || '#3d6cb3' : '#3d6cb3') : '#fff';
		const textColor = marker.is_saved ? '#fff' : '#111';
		const borderColor = marker.is_saved ? color : '#111';

		return (
			<CustomOverlayMap
				position={{lat: marker.pos_lat, lng: marker.pos_lng}}
				yAnchor={2.2}
			>
				<Chip
					color="default"
					size="small"
					label={marker.title}
					sx={{
						background:color,
						color: textColor,
						borderWidth:"1px",
						borderStyle:"solid",
						borderColor,
						fontSize: 13
					}}
				/>
			</CustomOverlayMap>
		)
	})

	return (
		<Layout>
			<Box component="div" sx={{display:"flex", flexDirection:"column", height:"100%"}}>
				<Box component="div" sx={{p:2, pt:0, position:"relative"}}>
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
							type="button"
							sx={{p: 1, borderRadius:0}}
							aria-label="검색하기"
							onClick={search}
						>
							<SearchIcon />
						</IconButton>
						<IconButton
							type="button"
							sx={{borderLeft:"1px solid #eee", borderRadius:0}}
							aria-label="새로고침"
							onClick={refreshMarkerList}
						>
							<ReplayIcon/>
						</IconButton>
					</Paper>
				</Box>
				<Box component="div" sx={{flex: "1 1 auto"}}>
					<Map
						center={{lat: 37.881377, lng: 127.729746 }}
						style={{width: "100%", height: "100%"}}
						onCreate={setMap}
					>
						{
							markers.map((marker:SelectMarkerListType) =>  (
								<div key={marker.idx}>
									<MapMarker
										position={{lat: marker.pos_lat, lng: marker.pos_lng}}
										image={{src: MarkerImg, size: {width:22, height:28}}}
										clickable={true}
										onClick={() => selectMarkerOpen(marker)}
									>
									</MapMarker>
									<MarkerChip marker={marker} folderColorMap={folderColorMap} />
								</div>
							))
						}
					</Map>
				</Box>
			</Box>

			{/* 팝업 :: 장소 등록 */}
			<PlaceFormModal open={open} onClose={selectMarkerClose} onConfirm={saveMarker} info={selectMarker} onDelete={deleteMaker}/>

			{/* 알림 :: 토스트 */}
			<ToastAlert toast={toast} />
		</Layout>
	)
}


export default PlaceList;