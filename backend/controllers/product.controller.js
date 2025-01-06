import { Redis } from "ioredis";
import Product from "../models/product.model.js"
import cloudinary from "../lib/cloudinary.js";
import redis from "../lib/redis.js";

export const getAllProducts = async (req,res) => {
    try {
        const products = await Product.find({}); // find all Products
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
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
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const {name, description, price, image, category} = req.body;
        let cloudinaryResponse = null;
        if(image) {
            await cloudinary.uploader.upload(image, (folder: "prodcuts"));
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.second.url: "",
            category
        })

        res.status(201).json(product);
    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`product/${publicId}`);
                console.log("deleted image from cloudinary")
            } catch (error) {
                console.log("Error in deleting image from cloudinary", error.message);
            }
        }
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { $sample: { size: 3 } },
            { $project: { _id: 1, name: 1, description: 1, price: 1, image: 1 } },
        ])
        res.json(products)
    } catch (error) {
        console.log("Error in getRecommendedProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    const {category} = req.params;
    try {
        const products = await Product.find({category});
        res.json(products);
    } catch (error) {
        console.log("Error in getProductsByCategory controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        } else {
            res.json(404),json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

async function updateFeaturedProductsCache() {
    // clear the cache
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products" , JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("Error in update cache function", error.message);
    }
};