import Coupon from "../models/coupon.model.js";
import {stripe} from '../lib/stripe.js';
import router from "../routes/product.route.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const {products, couponCode} = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid or empty products array" });
        }

        let totalAmount = 0;
        const lineItems = products.map(product => {
            const amount = Math.round(product.price * 100) // strpe wants u to send in the format of cents
            totalAmount = amount * product.quantity;
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                        metadata: {
                            id: product.id
                        }
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity
            }
        });
        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({
                userId: req.user._id, 
                code: couponCode 
            });
            if (coupon) {
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
            }
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}:3000/purchase-cancel`,
            discounts: coupon ? [
                {
                    coupon: await createStripeCoupon(coupon.discountPercentage)
                },
            ] : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
            },
        });
        if (totalAmount >= 20000) {
            await createNewCoupon(req.user._id);
        }
        res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 })
    } catch (error) {

    }
};

async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    })
    return coupon.id;
};

async function createNewCoupon (userId) {
    const newCoupon = new Coupon ({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: userId
    })

    await newCoupon.save();
    return newCoupon;
}

export default router;