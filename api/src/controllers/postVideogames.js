// 📍 POST | /videogames
// Esta ruta recibirá todos los datos necesarios para crear un videojuego y relacionarlo con sus géneros solicitados.
// Toda la información debe ser recibida por body.
// Debe crear un videojuego en la base de datos, y este debe estar relacionado con sus géneros indicados (al menos uno).
const Videogame = require("../db.js").Videogame;
const Genre = require("../db.js").Genre;
const { Op } = require("sequelize");

const postVideogames = async (req, res) => {
	try {
		const {
			name,
			description_raw,
			released,
			rating,
			platforms,
			genres,
			background_image,
		} = req.body;
		const videogame = await Videogame.findOrCreate({
			where: {
				name,
				description_raw,
				released,
				rating,
				platforms,
				background_image,
			},
		});

		const genresDb = await Genre.findAll({
			where: {
				name: {
					[Op.in]: genres,
				},
			},
		});

		await videogame[0].addGenres(genresDb);
		return res
			.status(200)
			.json({ message: "Videojuego agregado a la DB con éxito" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error interno del servidor" });
	}
};

module.exports = {
	postVideogames,
};
