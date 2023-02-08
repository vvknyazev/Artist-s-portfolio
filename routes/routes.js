const {Router} = require('express');
const fs = require("fs");
const multer = require("multer");
const Picture = require('../models/Picture');
const {requireAuth, checkUser, checkAdmin} = require("../middleware/authorization");


const router = new Router();

const upload = multer({dest: 'uploads/'})

router.get('/', async (req, res) => {
    const pictures = await Picture.find({}).lean();
    res.render('index', {
        title: 'Artist`s Portfolio',
        pictures
    });
});

router.post('/upload', upload.single('pic'), async (req, res) => {
    console.log(req.file);

    fs.rename(req.file.path, 'uploads/' + req.file.originalname, function (err) {
        if (err) throw err;
        console.log('renamed complete');
    });

    const picture = new Picture({
        title: req.body.title,
        picture: req.file.originalname
    })
    await picture.save()
    res.redirect('/')
})
router.post('/delete', checkAdmin, async (req, res) => {
    await Picture.deleteOne({_id: req.body.id});
    res.redirect('/')
})

router.get('/create', checkAdmin, (req, res) => {
    res.render('create', {
        title: 'Create new Work'
    });
})

// router.post('/auth/registration', async (req, res) => {
//     console.log(req.body.username);
//     res.redirect('/')
// })

module.exports = router;