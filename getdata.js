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
const deuda = async(gastos, roomMate)=> {
	roomMate = roomMate.map((r) => {
		r.debe = 0
		r.recibe = 0
		r.total = 0
		return r
	})
	gastos.forEach((g) => {
		roomMate = roomMate.map((r) => {
			const dividendo = Number((g.monto / roomMate.length).toFixed(2))
			if (g.roommate == r.nombre) {
				r.recibe += dividendo
			} else {
				r.debe -= dividendo
			}
			r.total = r.recibe - r.debe
			return r
		})
	})
}
module.exports = {getData, deuda}

