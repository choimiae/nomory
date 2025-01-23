import React, {useEffect, useState} from 'react';
import PlaceFormModal from "../components/PlaceFormModal";
import {Map, MapMarker, CustomOverlayMap} from 'react-kakao-maps-sdk';
import {Paper, IconButton, InputBase, Box, Chip, Link} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LogoImg from '../assets/logo.png';
import MarkerImg from '../assets/marker.png';

interface MarkerListType {
	position: {
		lat: number,
		lng: number
	},
	content: string,
	addrName: string
}


const List:React.FC = () => {
	const [markers, setMarkers] = useState<MarkerListType[]>([]);
	const [map, setMap] = useState<any>();
	const [input, setInput] = useState<string>('');
	const [selectMarker, setSelectMarker] = useState<MarkerListType | null>(null);
	const [open, setOpen] = useState<boolean>(false);
	const ps = new kakao.maps.services.Places();

	// 검색어 입력
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

		ps.keywordSearch(input, (data:any, status:any) => {
			if(status === kakao.maps.services.Status.OK) {
				const bounds = new kakao.maps.LatLngBounds();
				let markerArr = [];

				for (let i = 0; i < data.length; i++) {
					// 주소 중복 체크
					const isDuplicate = markerArr.some(item => item.addrName === data[i].address_name);

					if(isDuplicate)
						continue;

					markerArr.push({
						position: {
							lat: data[i].y,
							lng: data[i].x
						},
						content: data[i].place_name,
						addrName:data[i].address_name,
					});

					bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
				}

				setMarkers(markerArr);
				map.setBounds(bounds)
			}
		})
	}

	// 마커 클릭
	const selectMarkerOpen = (data:MarkerListType) => {
		setOpen(true);
		setSelectMarker(data);
	}


	// 마커 모달 닫기
	const selectMarkerClose = () => {
		setOpen(false);
		setSelectMarker(null);
	}


	return (
		<>
			<Box
				component="section"
				sx={{height:"100vh", display:"flex", flexDirection:"column"}}
			>
				<Box component="header" sx={{p:2, textAlign:"center"}}>
					<Box component="div" sx={{mb:1}}>
						<Link href="/list"><img src={LogoImg} alt="" style={{maxWidth:"100px"}}/></Link>
					</Box>
				</Box>
				<Box component="div" sx={{pl:2, pr:2, pb:2}}>
					<Paper
						component="div"
						variant="outlined"
						sx={{display: "flex", alignItems: "center", width: "100%"}}
					>
						<InputBase
							sx={{pl:2, pr:2, flex: 1}}
							placeholder="키위드/장소를 입력해주세요."
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
						markers.map((marker:MarkerListType) => (
							<div key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}>
								<MapMarker
									position={marker.position}
									image={{src: MarkerImg, size: {width:29, height:37}}}
									clickable={true}
									onClick={() => selectMarkerOpen(marker)}
								>
								</MapMarker>
								<CustomOverlayMap
									position={marker.position}
									yAnchor={2.5}
								>
									<Chip
										color="secondary"
										size="small"
										label={marker.content}
										sx={{fontSize:"12px"}}
									/>
								</CustomOverlayMap>
							</div>
						))
					}
				</Map>
			</Box>

			<PlaceFormModal open={open} onClose={selectMarkerClose} info={selectMarker}/>
		</>
	)
}


export default List;