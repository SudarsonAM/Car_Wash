const express = require ('express');
const app =express();
const path = require('path');
const User = require('./models/user_acc');
const Booking = require('./models/user_booking');
const Place = require('./models/admin_places');
const Service = require('./models/admin_services');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const Admin = require('./admin');


mongoose.connect('mongodb://localhost:27017/carwash', {useNewUrlParser: true, useUnifiedTopology: true})
.then((data)=>{
    console.log('MONGOOSE CONNECTED');
})
.catch((data)=>{
    console.log("MONGOOSE CONNECTION PROBLEM");
    console.log(data);
})



app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(session({secret : 'not a good secret'}));
app.use('/admin',Admin);


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

const services=[];
Service.find({}, function(err,users){
    
    if(err){
        console.log(err);
            next();
    }   
    for (let p of users){
        services.push(p.service);
    }
})

const slots =['Slot 1','Slot 2','Slot 3','Slot 4','Slot 5'];

//sign up
app.get('/user_signup',(req,res)=>{
    res.render('user/signup');
})
app.post('/user_signup',async(req,res)=>{
    const {firstname,lastname,username,password}=req.body;
    const hash = await bcrypt.hash(password,9);
    const user = User({
        firstname,
        lastname,
        username,
        password: hash
    })
    await user.save();
    res.redirect('/user_login');
        
})

//dashboard
app.get('/carwash/:id',async(req,res)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    if(req.session.user_id === id){
        res.render('user/dashboard',{userid:user._id,firstname : user.firstname, lastname: user.lastname, places: places,search: ""});
    }
    else{
        res.redirect('/user_login');
    }
})


//login
app.get('/user_login',(req,res)=>{
    res.render('user/login',{message:''});
})
app.post('/user_login',async(req,res)=>{
    try{
        const {username, password}=req.body;
        const user = await User.findOne({username});
        const Validity = await bcrypt.compare(password,user.password);
        if(Validity){
            req.session.user_id = user._id;
            res.redirect(`/carwash/${user._id}`);
        }
        else{
            res.redirect('/user_login');
        }
    }
    catch(err){
        res.render('user/login',{message:'Invalid Username or password'});
    }
})
//Search
app.post('/carwash/search/:id',async (req,res)=>{
    let search=req.body.sol;
    const {id} = req.params;
    const user = await User.findById(id);
    if(req.session.user_id === id){
        res.render('user/dashboard',{userid:user._id,firstname : user.firstname, lastname: user.lastname, places: places,search: search});
    }
    else{
        res.redirect(`/carwash/${id}`);
    }

})

//booking
app.get('/carwash/:id/place/:place',(req,res)=>{
    const {id,place}=req.params;
    res.render(`user/booking`,{id,place,slots,services:services,message:''});
})

app.post('/carwash/:id/place/:place/date',async (req,res)=>{
    const{id,place}=req.params;
    const user =await User.findById(id);
    const username = user.username;
    const {date}=(req.body);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    if(today.localeCompare(date)===1){
        res.render(`user/booking`,{id,place,slots,services:services,message:"Please Enter valid details"});
    }
    else{
        const y= String(date);
        const{service,slot}=req.body;
        const booking = await new Booking({username,service,date:y,slot,place,status:'pending'});
        await booking.save();
        res.redirect(`/carwash/${id}`);
    }
})


//logout
app.post('/user_logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/user_login');
})



app.listen(8080,()=>{
    console.log("LISTENING ON PORT 8080");
})



