// import express from 'express'
// const router=express.Router();
// const {userById}= require('../middleware/user');
// const {create, productById,read,remove,update,list,listRelated,listCategories,listBySearch,photo,
//     listSearch}= require('../middleware/shop');
//     const auth= require('../middleware/auth');


// router.route('/api/shops')
//   .get(shopCtrl.list)

// router.route('/api/shop/:shopId')
//   .get(shopCtrl.read)

// router.route('/api/shops/by/:userId')
//   .post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.isSeller, shopCtrl.create)
//   .get(authCtrl.requireSignin, authCtrl.hasAuthorization, shopCtrl.listByOwner)

// router.route('/api/shops/:shopId')
//   .put(authCtrl.requireSignin, shopCtrl.isOwner, shopCtrl.update)
//   .delete(authCtrl.requireSignin, shopCtrl.isOwner, shopCtrl.remove)

// router.route('/api/shops/logo/:shopId')
//   .get(shopCtrl.photo, shopCtrl.defaultPhoto)

// router.route('/api/shops/defaultphoto')
//   .get(shopCtrl.defaultPhoto)

// router.param('shopId', shopCtrl.shopByID)
// router.param('userId', userCtrl.userByID)

// module.exports=router;
const express=require("express");
const router=express.Router();
const {userById}= require('../middleware/user');
const {  create,
      shopByID,
      photo,
      defaultPhoto,
      list,
      listByOwner,
      read,
      update,
      isOwner,
      remove
}= require('../middleware/shop');
    const auth= require('../middleware/auth');



router.get("/shop/:shopId",auth, read);
router.post("/shop/create/:userId" ,auth,create);
router.delete( "/shop/:shopId/:userId",auth,  remove);
router.put( "/shop/:shopId/:userId",auth, update);
router.get("/shops",auth,list);
router.post("/shops/search",auth,listSearch);
router.get("/shops/related/:shopId",auth,listRelated)
router.get("/shops/categories",auth,listCategories);
router.post("/shops/by/search",auth,listBySearch);
router.get("/shop/photo/:productId",auth,photo);



router.param("userId",userById);
router.param("productId",auth,productById);


module.exports=router;