const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

const url = 'https://randomuser.me/api/'

const getData = async () => {
	try {
		const { data } = await axios.get(url)
		const user = {
			id: uuidv4().slice(10),
			nombre: `${ data.results[0].name.first} ${ data.results[0].name.last}`,
			debe: 0,
			recibe: 0,
			correo: data.results[0].email,
		}
		return user
	} catch (error) {
		console.log(error)
	}
}


module.exports = getData
