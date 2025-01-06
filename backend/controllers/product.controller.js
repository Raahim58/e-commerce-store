import { Redis } from "ioredis";
import Product from "../models/product.model.js"

export const getAllProducts = async (req,res) => {
    try {
        const products = await Product.find({}); // find all Products
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: "Sever error", error: error.message });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await Redis.get("featured_products")
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }

        // if not in redis, fetch from mongoDB
        // .lean() is gonna return a plan JS object instead of a mongoDB document which is good for performance
        featuredProducts = await Product.find({ isFeatured: true }).lean();
        if (!featuredProducts) {
            return res.status(404).json({ message: "No featured products found" });
        }

        // store in redis for future quick access
        await Redis.set("featured_products", JSON.stringify(featuredProducts)); 
        res.json({ products: featuredProducts });
    } catch (error) {
        console.log("Error in getFeaturedProducts controller", error.message);
        res.status(500).json({ message: "Sever error", error: error.message });
    }
}