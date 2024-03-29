
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.productById=(req,res,next,id)=>{
    if(req.user.role === 'seller'){
    Product.findById(id).exec((err,product)=>{
        if (err || !product){
            return res.status(400).json({
                error:"Product not found"
            });
        }
        req.product=product;
        next();
    });
}
else return res.status(401).json({error:"unauthorized user"})
};

exports.read = function (req, res) {
        if(req.user.role==='seller' || req.user.role==='customer'){

    Product.findById(req.params.productId, function (err, product) {
            // console.log(req.params.productId,)

        if (err) return next(err);
        res.send(product);
    })
    }
else return res.status(401).json({error:"unauthorized user"})
};



    exports.update = (req, res)=> {
        console.log(req);
        console.log(res);
        return false;
        Product.findByIdAndUpdate(req.params.productId, {$set: req.body}, function (err, product) {
            // console.log(req.params)

            // console.log(req.params.productId)
            if (err) return next(err);
            res.send('Product updated.');
        });
    };


exports.create = (req, res) => {
    if(req.user.role==='seller' ){

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        // check for all fields
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = fields;

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !quantity ||
            !shipping
        ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        let product = new Product(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
}
else return res.status(401).json({error:"unauthorized user"})
};
exports.create= (req, res) => {
    if(req.user.role==='seller' ){

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        // check for all fields
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = fields;

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !quantity ||
            !shipping
        ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        // let product = req.product;
        // product=_.extend(product,fields)
 let product = new Product(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });

}
else return res.status(401).json({error:"unauthorized user"})
};
exports.remove = (req, res) => {
    if(req.user.role==='seller' || req.user.role==='customer'){
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Product deleted successfully"
        });
    });
}
else return res.status(401).json({error:"unauthorized user"})
};
exports.update = (req, res) => {
    if(req.user.role==='seller' ){

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }

     
        let product = new Product;

        product = _.extend(product, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
}
else return res.status(401).json({error:"unauthorized user"})
};
/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */
exports.list = (req, res) => {
    if(req.user.role==='seller' || req.user.role==='customer'){
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json(products);
        });
    }
    else return res.status(401).json({error:"unauthorized user"})
};

/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 */

exports.listRelated=(req,res)=>{
    if(req.user.role==='seller' || req.user.role==='customer'){
    let limit=req.query.limit ? parseInt(req.query.limit):6;
    Product.find({_id:{$ne:req.product},category:req.product.category})
    .limit(limit)
    .populate('category','_id name')
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({
                error:"Product not found"
            });
        }
        res.json(products);
    });
}
else return res.status(401).json({error:"unauthorized user"})
};

exports.listCategories = (req, res) => {
    if(req.user.role==='seller' || req.user.role==='customer'){

    Product.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "Categories not found"
            });
        }
        res.json(categories);
    });
}
else return res.status(401).json({error:"unauthorized user"})
};
/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
    if(req.user.role==='seller' || req.user.role==='customer'){
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                //that will be for categories
                findArgs[key] = req.body.filters[key];
            }
        }
    }
    Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: "Products not found"
            });
        }
        res.json({
            size: data.length,
            data
        });
    });
}
else return res.status(401).json({error:"unauthorized user"})
};
exports.photo=(req,res,next)=>{
    if(req.user.role==='seller' ){
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}
else return res.status(401).json({error:"unauthorized user"})
};
exports.listSearch = (req, res) => {
    if(req.user.role==='seller' || req.user.role==='customer'){

    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: "i" };
        // assigne category value to query.category
        if (req.query.category && req.query.category != "All") {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
        }).select("-photo");
    }
}
else return res.status(401).json({error:"unauthorized user"})
};