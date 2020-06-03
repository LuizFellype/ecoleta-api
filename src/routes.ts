import express from 'express'
import knex from './database/connections'

const routes = express.Router()

routes.get('/items', async (req, res) => {
    try {
        console.log('---')
        const items = await knex('items').select('*')
        console.log('---', items)
        const serializedItems = items.map(({ title, image }) => ({ title, image_url: `http://localhost:3333/uploads/${image}` }))
        res.json(serializedItems)
    } catch (error) {
        console.log('<<<<<<<<<<<<<<<------>>>>>>>>>>>>>>>', error)
        res.json(error)
    }
})


routes.get('/points', async (req, res) => {
    const { city, uf, items } = req.query
    const parsedItems = String(items).split(',').map(item => Number(item.trim()))
    
      try {
        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

            res.json(points)
    } catch (error) {
        res.status(500).json(error)
    }
})

routes.get('/point/:id', async (req, res) => {
    const { id } = req.params
    
    try {
        const point = await knex('points').where('id', id).first()
        
        if (!point) return res.status(400).json({ message: 'Point not found' })

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id).select('items.title')

        return res.json({point, items})
    } catch (error) {
        res.json(error)
    }
})

routes.post('/points', async (req, res) => {
    const {
        items,
        ...point
    } = req.body || {}
    const _point = { ...point, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60' }
    
    try {
        const trx = await knex.transaction()
        
        const [point_id] = await trx('points').insert(_point)

        const pointItems = items.map((item_id: number) => ({ item_id, point_id }))
        
        await trx('point_items').insert(pointItems)
        
        await trx.commit()

        res.json({ ..._point, id: point_id })
    } catch (err) {
        res.json({ err: err.message })
    }
})

routes.get('/', (req, res) => {
    res.json({ ok: true })
})

export default routes