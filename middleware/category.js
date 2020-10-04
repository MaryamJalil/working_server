
const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.categoryById=(req,res,next,id)=>{
    if(req.user.role === 'seller'){
    Category.findById(id).exec((err,category)=>{
        if (err || !category){
            return res.status(400).json({
                error:"Category does not exist"
            });
        }
        req.category=category;
        next();
    });
}
else return res.status(401).json({error:"unauthorized user"})
}
exports.create = (req, res) => {
    if(req.user.role === 'seller'){
      const {name} = req.body;

      const category = new Category({name:name, userId: req.user.id});
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ data });
    });
}
else return res.status(401).json({error:"unauthorized user"})
};
exports.read=(req,res)=>{
    if(req.user.role==='seller' || req.user.role==='customer'){

   return res.json(req.category);
}
else return res.status(401).json({error:"unauthorized user"})
};

// exports.update = (req, res) => {
//     if(req.user.role === 'seller'){
//         // Category.findOneAndUpdate({$set: {name:req.body.name}})
//         // Category.findOneAndUpdate({_id:req.params.categoryId, userId: req.user.id})
//         Category.findOneAndUpdate({$set: {name:req.body.name}})
exports.update = (req, res) => {
  if(req.user.role === 'seller'){
       Category.findOneAndUpdate({_id:req.params.categoryId, userId: req.user.id} , {$set: {name:req.body.name}})


        .then((category) => {
            if (!category) {
              return res.status(404).send({
                message: "Category not found ",
              });
            }
            res.send({ message: "Category updated successfully!" });
          })
          .catch((err) => {
            return res.status(500).send({
              message: "Could not update category",
            });
          });
      }
      else return res.status(401).json({errors:[{msg:"unauthorized user}]"}]})
      
          
      };
exports.remove=(req,res)=>{
    if(req.user.role === 'seller'){

    Category.findOneAndDelete({_id:req.params.categoryId})
    // Category.findOneAndDelete(req.body.category)

    .then((category) => {
      if (!category) {
        return res.status(404).send({
          message: "Category not found ",
        });
      }
      res.send({ message: "Category deleted successfully!" });
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Could not delete category",
      });
    });
}
else return res.status(401).json({errors:[{msg:"unauthorized user}]"}]})

    
};

// exports.deleteCategory = (req, res) => {
//   Category.findByIdAndDelete({_id:req.params.categoryId})
//     .then(() => {
//       return res.status(200).json({
//         message: `Category was deleted Succefully`
//       });
//     })
//     .catch(error => {
//       return res
//         .status(400)
//         .json({ error, message: "Couldn't delete, please try again" });
//     });
// };
exports.list=(req,res)=>{
    if(req.user.role==='seller' || req.user.role==='customer'){

    Category.find({userId:req.user.id}).exec((err,data)=>{
        if (err){
            return res.status(400).json({errors:[{ msg: err }]});
        }
        return res.json(data);
    });
}
else return res.status(401).json({errors:[{msg:"unauthorized user}]"}]})
    
}