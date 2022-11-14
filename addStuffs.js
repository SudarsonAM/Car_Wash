const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/admin_acc');

mongoose.connect('mongodb://localhost:27017/carwash', {useNewUrlParser: true, useUnifiedTopology: true})
.then((data)=>{
    console.log('MONGOOSE CONNECTED');
})
.catch((data)=>{
    console.log("MONGOOSE CONNECTION PROBLEM");
})
async function hashing(){
    const hash = await bcrypt.hash('peter123',9);
    const hashing = await new Admin({firstname:'Peter',lastname:'Lee',username:'peter@gmail.com',password:hash});
    await console.log(hashing);
    const wait = await Admin.insertMany(hashing)
    .then((res)=>{
        console.log(res);
    })
    .catch((err)=>{
        console.log(err);
    })

}
hashing();
// const hash =hashing()
// const seedPlaces = new Admin({firstname:'Peter',lastname:'Lee',username:'peter@gmail.com',password:hash});

// const seedPlaces= hashing();
// console.log(seedPlaces);


// Admin.insertMany(seedPlaces)
//     .then((res)=>{
//         console.log(res);
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
