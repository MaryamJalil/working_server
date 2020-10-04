const express=require("express");
const router=express.Router();
const {read,create,update,remove,list}= require('../middleware/Hospital');
const {userById}= require('../middleware/user');
const auth= require('../middleware/auth');




router.get("/hospital/:hospitalId" ,auth,read);
router.post("/hospital/create/:userId",auth,create);
router.put("/hospital/:hospitalId/:userId" ,auth,update);
router.delete("/hospital/:hospitalId/:userId" ,auth,remove);
router.get("/hospitals" ,auth,list);





router.param("hospitalId",auth);
router.param("userId",userById);


module.exports=router;

