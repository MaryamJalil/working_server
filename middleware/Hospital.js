
const Hospital= require("../models/Hospital");
const { errorHandler } = require("../helpers/dbErrorHandler");
var moment = require('moment');


exports.hospitalById=(req,res,next,id)=>{
    if(req.user.role === 'doctor'){
    Category.findById(id).exec((err,hospital)=>{
        if (err || !hospital){
            return res.status(400).json({
                error:"Hospital does not exist"
            });
        }
        req.hospital=hospital;
        next();
    });
}
else return res.status(401).json({error:"unauthorized user"})
}

exports.create = (req, res) => {

        if(req.user.role === 'doctor'){
  if (!req.body.hospitalName || !req.body.doctor || !req.body.date) {
    return res.status(400).send({
      message: "Required field can not be empty",
    });
  }

  const hospital = new Hospital({
    hospitalName: req.body.hospitalName,
    doctor: req.body.doctor,
    date: req.body.date, 
    // date :moment().format("MMM Do YY")


  });

  /**
   * Save hospital to database
   */
 hospital
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
}

else return res.status(401).json({error:"unauthorized user"})
};
exports.read=(req,res)=>{
    if(req.user.role==='doctor' || req.user.role==='customer'||req.user.role==='admin'){
        Hospital.findById(req.params.hospitalId, function (err, hospital) {
            // console.log(req.params.productId,)

        if (err) return next(err);
        res.send(hospital);
    })
    }
else return res.status(401).json({error:"unauthorized user"})
};

exports.update = (req, res) => 
{

        if(req.user.role === 'doctor'){
    if (!req.body.hospitalName || !req.body.doctor|| !req.body.date) {
      res.status(400).send({
        message: "required fields cannot be empty",
      });
    }
    Hospital.findByIdAndUpdate(req.params.hospitalId, req.body, { new: true })
      .then((hospital) => {
        if (!hospital) {
          return res.status(404).send({
            message: "no hospital found",
          });
        }
        res.status(200).send(hospital);
      })
      .catch((err) => {
        return res.status(404).send({
          message: "error while updating the post",
        });
      });
    }
    else return res.status(401).json({error:"unauthorized hospital"})
    };


exports.remove=async(req,res)=>{
    if(req.user.role === 'doctor'){
        try{
            let hospital=await Hospital.findById(req.params.hospitalId)
            if(!hospital){
                return res.status(404).json({msg:'Hospital not found'})
            }
            await Hospital.findByIdAndRemove(req.params.hospitalId)
            res.send('hospital removed')
            
    
        }catch(err){
            console.error(err.message)
            res.status(500).send('Server Error')
    
        }
    
}
else return res.status(401).json({error:"unauthorized user"})
    
};
exports.list=(req,res)=>{
    if(req.user.role==='doctor' || req.user.role==='customer'){

    Hospital.find().exec((err,data)=>{
        if (err){
            return res.status(400).json({
                error:errorHandler(err)
            });
        }
        res.json(data);
    });
}
else return res.status(401).json({error:"unauthorized user"})
    
}