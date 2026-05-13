const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


// Create Payment Intent
const createPayment = async (req, res) => {

  try {

    const { amount } = req.body;

    const paymentIntent =
      await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "inr"
      });

    res.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  createPayment
};