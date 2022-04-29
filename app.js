const express = require('express')
const Product = require('./models/Product')
const mongoose = require('mongoose')

const app = express()
app.set('view engine','hbs')
app.use(express.urlencoded({extended:true}))

app.get('/sorting',async (req,res)=>{
    const searchDevice = req.body.txtDevice
    const query = await Product.find({'device':searchDevice})
    res.render('allProduct',{'products':query})
})

app.post('/edit',async (req,res)=>{
    const id = req.body.id
    const name = req.body.txtName
    const price = req.body.txtPrice
    const device = req.body.txtDevice
    const picURL = req.body.txtPic
    var prod = await Product.findById(id)
    prod.name = name
    prod.price = price
    prod.device = device
    prod.picURL = picURL
    prod.save((err)=>{
        if(!err)
            console.log("Ok")
        res.redirect("/viewAll")
    })    
})

app.get('/edit',async (req,res)=>{
    const id = req.query.id
    const prod = await Product.findById(id)
    res.render('edit',{'product':prod})
})

app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/sort',(req,res)=>{
    res.render('sort')
})
app.get('/new',(req,res)=>{
    res.render('newProduct')
})
app.post('/searchByName',async (req,res)=>{
    const searchText = req.body.txtSearchByName
    var page = req.query.page
    if(page ==1){
        const query = await  Product.find({'name':searchText}).limit(5)
        res.render('allProduct',{'products':query})
    }else if(page==2){
        const query = await  Product.find({'name':searchText}).skip(5).limit(5)
        res.render('allProduct',{'products':query})
    }else{
        const query = await  Product.find({'name':searchText})
        res.render('allProduct',{'products':query})
    }    
})

app.post('/searchByPrice',async (req,res)=>{
    const searchText = req.body.txtSearchByPrice
    var page = req.query.page
    if(page ==1){
        const query = await  Product.find({'price':searchText}).limit(5)
        res.render('allProduct',{'products':query})
    }else if(page==2){
        const query = await  Product.find({'price':searchText}).skip(5).limit(5)
        res.render('allProduct',{'products':query})
    }else{
        const query = await  Product.find({'price':searchText})
        res.render('allProduct',{'products':query})
    }
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id
    await Product.deleteOne({'_id':id})
    res.redirect('/viewAll')
})

app.get('/viewAll', async (req,res)=>{  
    var page = req.query.page
    if(page ==1){
        const query = await  Product.find().limit(5)
        res.render('allProduct',{'products':query})
    }else if(page==2){
        const query = await  Product.find().skip(5).limit(5)
        res.render('allProduct',{'products':query})
    }else{
        const query = await  Product.find()
        res.render('allProduct',{'products':query})
    }    
})

app.post('/newProduct',async (req,res)=>{
    const name = req.body.txtName
    const price  = req.body.txtPrice
    const device = req.body.txtDevice
    const picURL  = req.body.txtPic
    let error = new Object()
    let flag = true
    if(name.trim().length == 0){
        error["name"] = "Name cannot be empty!"
        flag = false
        console.log("Name cannot be empty!")
    }
    if(price.trim().length == 0){
        error["price"] = "Price cannot be empty!"
        flag = false
        console.log("Price cannot be empty!")
    }
    if(typeof price!="number"){
        error["price"] = "Price must be in number!"
        flag = false
        console.log("Price must be in number!")
    }
    if(picURL.trim().length < 10){
        error = "The picture URL is not valid!"
        flag = false
        console.log("The picture URL is not valid!")
    }
    if(flag==true){
        let product = new Product({'name':name,'price':price,'device':device ,'picURL':picURL})
        await product.save()
        console.log("New product was saved: " + product._id)
        res.redirect('/')
    }else{
        res.render('home',{'error':error})
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running!")