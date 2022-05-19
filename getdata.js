const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

const url = 'https://randomuser.me/api/'

const getData = async () => {
	try {
		const { data } = await axios.get(url)
		const { first, last } = data.results[0].name
		const user = {
			id: uuidv4().slice(30),
			nombre: `${first} ${last}`,
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
