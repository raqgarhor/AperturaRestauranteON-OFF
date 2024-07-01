import { Restaurant, Order } from '../models/models.js'

const checkRestaurantOwnership = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    if (req.user.id === restaurant.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}
const restaurantHasNoOrders = async (req, res, next) => {
  try {
    const numberOfRestaurantOrders = await Order.count({
      where: { restaurantId: req.params.restaurantId }
    })
    if (numberOfRestaurantOrders === 0) {
      return next()
    }
    return res.status(409).send('Some orders belong to this restaurant.')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

// SOLUCION
const restaurantHasNoClosedOrClosedTemporaryStatus = async (req, res, next) => {
  try {
    const restaurant = await Order.findByPk(req.params.restaurantId)
    if (restaurant.status === 'closed') {
      return res.status(409).send('The restaurant is closed.')
    }
    if (restaurant.status === 'temporarily closed') {
      return res.status(409).send('The restaurant is temporarily closed.')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}
// SOLUCION
const restaurantHasNoPendingOrders = async (req, res, next) => {
  try {
    const restaurantOrders = await Order.findAll({
      where: { restaurantId: req.params.restaurantId }
    })
    for (const order of restaurantOrders) {
      if (order.deliveredAt === null) {
        return res.status(409).send('Some orders belong to this restaurant.')
      }
    }
    return next()
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export { checkRestaurantOwnership, restaurantHasNoOrders, restaurantHasNoClosedOrClosedTemporaryStatus, restaurantHasNoPendingOrders }
