const express=require("express");
const router=express.Router();
const {create ,categoryById,read ,update,list,remove}= require('../middleware/category');
const {userById}= require('../middleware/user');
const auth= require('../middleware/auth');



router.get("/category/:categoryId" ,auth,read);
router.post("/category/create/:userId",auth,create);
router.put("/category/:categoryId" ,auth,update);
router.delete("/category/:categoryId" ,auth,remove);
router.get("/categories" ,auth,list);





router.param("categoryId",auth,categoryById);
router.param("userId",userById);


module.exports=router;