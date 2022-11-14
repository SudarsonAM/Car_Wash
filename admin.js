const express = require ('express');
const app =express();
const path = require('path');
const Booking = require('./models/user_booking');
const Place = require('./models/admin_places');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const Admin =require('./models/admin_acc');
var router  = express.Router();
const Service = require('./models/admin_services');



app.use(session({secret : 'not a good secret'}));

const places=[];
Place.find({}, function(err,users){
    
    if(err){
        console.log(err);
            next();
    }   
    for (let p of users){
        places.push(p.place);
    }
})

const slots =['Slot 1','Slot 2','Slot 3','Slot 4','Slot 5'];

//login
router.get('/login',async (req,res)=>{
    res.render('admin/sign_in');
})
router.post('/login',async (req,res)=>{
    const {username, password}=req.body;
    const admin = await Admin.findOne({username});
    const Validity = await bcrypt.compare(password,admin.password);
    if(Validity){
        req.session.user_id = admin._id;
        res.redirect(`homepage/${admin._id}`);
        
    }
    else{
        res.redirect('/admin/login');
    }
})

//homepage
router.get('/homepage/:id',async(req,res)=>{
    const {id} = req.params;
    const admin = await Admin.findById(id);
    await Booking.find({})
        .then((data)=>{
            //console.log(data.username);
            if(req.session.user_id === id){
                res.render('admin/homePage',{admin: admin,id:id,totalBooking:data, statuss:['approved','rejected']});
                //console.log(places);
            }
            else{
                res.redirect('/admin/login');
            }
        })
    
})

//addplace
router.post('/:id/addplace',async (req,res)=>{
    const {id} = req.params;
    const admin = await Admin.findById(id);
    if(req.session.user_id === id){
        res.redirect(`/admin/${id}/addplace`);
    }
    else{
        res.redirect('admin/login');
    }
})
router.get('/:id/addplace',async(req,res)=>{
    const {id} = req.params;
    const admin = await Admin.findById(id);
    if(req.session.user_id === id){
        res.render('admin/addPlace',{admin,id});
    }
    else{
        res.redirect('/admin/login');
    }
})

router.post('/:id/addedplace',async(req,res)=>{
    const {id} = req.params;
    const admin = await Admin.findById(id);
    if(req.session.user_id === id){
        const place= req.body.place;
        try{
            const existingplace = await Place.findOne({place});
            if(existingplace===null){
                const x = place.toLowerCase()
                const newPlace = await new Place({place:x});
                await newPlace.save();
                places.push(place);
                res.redirect(`/admin/homepage/${id}`);
            }
            else{
                res.redirect(`/admin/${id}/addplace`);
            }
        }
        catch(err){
            res.send("error");
        }
    }
    else{
        res.redirect(`/admin/${id}/addplace`);
    }
})


//add service
router.post('/:id/addservice',async (req,res)=>{
    const {id} = req.params;
    const admin = await Admin.findById(id);
    if(req.session.user_id === id){
        res.redirect(`/admin/${id}/addservice`);
    }
    else{
        res.redirect('admin/login');
    }
})
router.get('/:id/addservice',async(req,res)=>{
    const {id} = req.params;
    const admin = await Admin.findById(id);
    if(req.session.user_id === id){
        res.render('admin/addService',{admin,id});
    }
    else{
        res.redirect('/admin/login');
    }
})

router.post('/:id/addedservice',async(req,res)=>{
    const {id} = req.params;
    const admin = await Admin.findById(id);
    if(req.session.user_id === id){
        const service= req.body.service;
        try{
            const existingservice = await Service.findOne({service});
            if(existingservice===null){
                const x = service.toLowerCase()
                const newService = await new Service({service:x});
                await newService.save();
                res.redirect(`/admin/homepage/${id}`);
            }
            else{
                res.redirect(`/admin/${id}/addservice`);
            }
        }
        catch(err){
            res.send("error");
        }
    }
    else{
        res.redirect(`/admin/${id}/addplace`);
    }
})

//search date
router.post('/homepage/:id/searchdate',async(req,res)=>{
    const {id} = req.params;
    const admin = await Admin.findById(id);
    const {date}=req.body;
    await Booking.find({date:date})
    .then((data)=>{
        if(req.session.user_id === id){
            res.render('admin/homePage',{admin: admin,id:id,totalBooking:data, statuss:['approved','rejected']});
            //console.log(places);
        }
        else{
            res.redirect('/admin/login');
        }
    })
})

//search place
router.post('/homepage/:id/searchplace',async(req,res)=>{
    const {id} = req.params;
    const admin = await Admin.findById(id);
    const {place}=req.body;
    await Booking.find({place})
    .then((data)=>{
        if(req.session.user_id === id){
            if(data===null){
                res.redirect(`/admin/homepage/${id}`);
            }
            res.render('admin/homePage',{admin: admin,id:id,totalBooking:data, statuss:['approved','rejected']});
            //console.log(places);
        }
        
        else{
            res.redirect('/admin/login');
        }
    })
})

//set status
router.post('/homepage/:id/setstatus/:_id',async (req,res)=>{
    const {id,_id}=req.params;
    const admin = await Admin.findById(id);
    await Booking.findByIdAndUpdate({_id},{status:req.body.status},{new:true, runValidators:true})
        .then((data)=>{
        })
    res.redirect(`/admin/homepage/${id}`);
})

//logout
router.post('/admin_logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/admin/login');
})


module.exports = router;