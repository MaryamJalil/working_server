const express=require("express");
const router=express.Router();
const {read,create,update,remove,list,appointmentById}= require('../middleware/Patient');
const {userById}= require('../middleware/user');
const auth= require('../middleware/auth');




router.get("/appointmnet/:appointmentId" ,auth,read);
router.post("/appointment/create/:appointmentId",auth,create);
router.put("/appointment/:appointmentId/:userId" ,auth,update);
router.delete("/appointment/:appointmentId/:userId" ,auth,remove);
router.get("/appointments" ,auth,list);





router.param("appointmentId",auth,appointmentById);
router.param("userId",userById);


module.exports=router;