
const { response } = require('express');
const db = require('../db');
const knex = require('knex')({
    client: 'pg',
    connection: {
        database: 'citymeal',
        user: process.env.PGUSERNAME,
        password: process.env.PGPASSWORD
    }
});

class Favorites {
    
    async saveFavorite(req, res) {
        const { user_id } = req.params
        const { location_id } = req.body;

        console.log(user_id, location_id)
        const checkFavorite = await knex('favorites').where({
            location_id: location_id,
            user_id: user_id
        })

        if (checkFavorite.length > 0) {
            return res.status(500).json("Already Favorited")
        }
        try {
            let savedFavorite = await knex('favorites').insert({
                location_id: location_id,
                user_id: user_id
            });
            res.status(200).json({
                favorite: savedFavorite
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }

    }

    async getFavorites(req, res) {
        let userID = req.params.user_id
        try {
            let favorites = await knex('favorites').where({
                user_id: userID
            });
            res.status(200).json({
                favorites: favorites
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    }
    async deleteFavorite(req, res) {
        const {user_id} = req.params
        const {location_id} = req.body
        console.log(req.params,'param')
        console.log(req.body)
        try {
            const deletedFavorite = await knex('favorites').where({
                location_id: location_id,
                user_id: user_id
            }).del();
            res.status(200).json({
                message: "user has been deleted", location_id: location_id,
                user_id: user_id
            });

        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    }
}

module.exports = Favorites