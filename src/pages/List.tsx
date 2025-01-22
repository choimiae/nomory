import React, {useEffect, useState} from 'react';
import PlaceFormModal from "../components/PlaceFormModal";
import {Map, MapMarker, CustomOverlayMap} from 'react-kakao-maps-sdk';
import {Paper, IconButton, InputBase, Box, Chip} from '@mui/material';
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
	const [info, setInfo] = useState();
	const [markers, setMarkers] = useState<MarkerListType[]>([]);
	const [map, setMap] = useState<any>();
	const [input, setInput] = useState<string>('');

	const ps = new kakao.maps.services.Places();
	const geocoder = new kakao.maps.services.Geocoder();
	const bounds = new kakao.maps.LatLngBounds();

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
	const markerClick = (data:MarkerListType) => {
		console.log(data)
	}


	return (
		<>
			<Box
				component="section"
				sx={{height:"100vh"}}
			>
				<Box component="header" sx={{p:2, textAlign:"center"}}>
					<Box component="div" sx={{mb:1}}>
						<img src={LogoImg} alt="" style={{maxWidth:"100px"}}/>
					</Box>
					<Paper
						component="div"
						variant="outlined"
						sx={{display: "flex", alignItems: "center", width: "100%"}}
					>
						<InputBase
							sx={{pl:2, pr:2, flex: 1}}
							placeholder="장소를 입력해 주세요."
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
					style={{width: "100%", height: "calc(100% - 55px)", borderRadius:"4px"}}
					onCreate={setMap}
				>
					{
						markers.map((marker:MarkerListType) => (
							<div key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}>
								<MapMarker
									position={marker.position}
									image={{src: MarkerImg, size: {width:29, height:37}}}
									clickable={true}
									onClick={() => markerClick(marker)}
								>
								</MapMarker>
								<CustomOverlayMap
									position={marker.position}
									yAnchor={2.6}
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

			{/*<PlaceFormModal title="sdsd" content="1212" date="121212" memo="12122"/>*/}
		</>
	)
}


export default List;