import React from "react";
import {Map} from "react-kakao-maps-sdk";

function Maps() {
	return (
		<Map
			center={{lat: 33.5563, lng: 126.79581}}
			style={{width: "100%", height: "360px"}}
		>
		</Map>
	)
}


export default Maps;