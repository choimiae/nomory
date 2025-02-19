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
	}
})

export default theme;