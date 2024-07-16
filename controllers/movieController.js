let { User, Movie, Cart } = require('../models/');

const midtransClient = require('midtrans-client');
let axios = require('axios');

class movieController {
    static async getMovie(req, res, next) {
        try {
            let { page } = req.query
            let movieAPI = ``
            if (page) movieAPI += `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.APIkey}&language=en-US&page=${page}`
            else movieAPI += `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.APIkey}&language=en-US&page=1`
            let { data } = await axios({
                url: movieAPI,
                method: "GET",
            })
            movieAPI = ''
            res.status(200).json({ movies: data.results })
        } catch (error) {
            next(error)
        }
    }
    static async getDetailMovie(req, res, next) {
        try {
            let { id } = req.params
            let movieAPI = `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.APIkey}&language=en-US&append_to_response=videos`
            let { data } = await axios({
                url: movieAPI,
                method: "GET",
            })
            // console.log(data)
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }

    static async getGenre(req, res, next) {
        // let genreApi = `https://api.themoviedb.org/3/genre/movie/list?api_key=c4d809a9cf31fcc2c4d624e115c02593`
        // console.log(genreApi)
        try {
            let genreApi = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.APIkey}&language=en-US`
            let { data } = await axios({
                url: genreApi,
                method: "GET",
            })
            // console.log(data)
            res.status(200).json(data.genres)
        } catch (error) {
            // console.log(error)
            next(error)
        } try {

        } catch (error) {

        }
    }

    static async payment(req, res, next) {
        console.log(process.env.MIDTRANS_SERVER_KEY_GENERATE)
        try {
            let snap = new midtransClient.Snap({
                // Set to true if you want Production Environment (accept real transaction).
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY
            });

            let parameter = {
                "transaction_details": {
                    "order_id": Math.floor(Math.random() * 9999999),
                    "gross_amount": 1000
                },
                "credit_card": {
                    "secure": true
                },
                "customer_details": {
                    "first_name": "Sat",
                    "last_name": "Set",
                    "email": "Laksonosatriyo@gmail.com",
                    "phone": "0813110997554"
                },
                "bca_va": {
                    "va_number": "12345678911",
                    "sub_company_code": "00000",
                    "free_text": {
                        "inquiry": [
                            {
                                "en": "text in English",
                                "id": "text in Bahasa Indonesia"
                            }
                        ],
                        "payment": [
                            {
                                "en": "text in English",
                                "id": "text in Bahasa Indonesia"
                            }
                        ]
                    }
                },
            };

            const midtransToken = await snap.createTransaction(parameter)
            console.log(midtransToken)
            res.status(200).json(midtransToken)

        } catch (error) {
            next(error)
        }
    }

    static async addCart(req, res, next) {

        try {
            let { title, id, poster_path } = req.body
            const [movie, created] = await Movie.findOrCreate({
                where: {
                    id_tmdb: id
                },
                defaults: {
                    title,
                    id_tmdb: id,
                    poster_path,
                    price: id * 100
                },
            });
            // console.log(movie)
            await Cart.create({ UserId: req.user.id, MovieId: movie.id, status: 'pending' })
            res.status(201).json({ messagge: `Sucsess add ${movie.title} to cart` })
        } catch (error) {
            console.log(error)
        }
    }

    static async getRecomendation(req, res, next) {
        // url: `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.APIkey}`,
        try {
            let { recomendation } = req.query
            let { data } = await axios({
                url: `https://api.themoviedb.org/3/movie/${recomendation}/recommendations?api_key=${process.env.APIkey}&language=en-US&page=1`,
                method: "GET",
            })
            // console.log(data)
            res.status(200).json({ results: data.results.slice(0, 9) })
        } catch (error) {
            next(error)
        }
    }

    static async getCart(req, res, next) {
        try {
            let option = {
                include: [
                    {
                        model: User,
                        attributes: {
                            exclude: ["password", "createdAt", "updatedAt"]
                        }
                    },
                    {
                        model: Movie,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    }
                ],
                where: {
                    UserId: req.user.id
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            }

            let cart = await Cart.findAll(option)

            // console.log(cart[0].Movie)
            res.status(200).json({ cart })
        } catch (error) {
            console.log(error)
        }
    }

    static async deleteCart(req, res, next) {
        try {
            let { id } = req.params
            let option = {
                where: {
                    id
                }
            }
            // let data = Cart.findByPk(id)
            // if (!data) throw { name: 'NotFound' }
            // console.log(data)
            await Cart.destroy(option)

            res.status(200).json({ messagge: `Movie was deleted` })

        } catch (error) {
            next(error)
        }
    }

}

module.exports = movieController