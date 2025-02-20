import React from 'react';
import {Box, TextField} from '@mui/material';
import Layout from "../template/Layout";

const Register:React.FC = () => {

	return (
		<Layout>
			<Box component="section">
				<TextField
					autoFocus
					required
					margin="dense"
					label="아이디"
					type="text"
					value=""
					fullWidth
					multiline
					variant="standard"
				/>
			</Box>
		</Layout>
	)
}

export default Register;