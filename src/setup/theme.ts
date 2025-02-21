import {createTheme} from '@mui/material/styles';

const theme = createTheme({
	palette: {
		primary: {
			main: '#3d6cb3'
		},
		secondary: {
			main: '#111'
		}
	},
	typography: {
		fontFamily: `'Bazzi', sans-serif`,
		h1: {
			fontSize:"1.4em"
		},
		h2: {
			fontSize:"1.3em"
		}
	}
})

export default theme;