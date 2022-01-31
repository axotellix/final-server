const express = require('express');
const app = express();
const cors = require('cors');
const upload = require('express-fileupload');
const fetch = require('cross-fetch');
const path = require('path');


// [ SYSTEM SETTINGS ]
app.set('view engine', 'ejs');  
app.use(cors());
app.use(upload());

// [ PRESETS ]
const api   = 'http://rsandrey.pythonanywhere.com/'
const front = 'https://final-axotellix.vercel.app/'


// [ ROUTES ]
app.get('/', function (req, res) {
    res.send('hello from root level!')
})

app.get('/random-img', function (req, res) {
    const max = 3
    const min = 1
    let rand = Math.floor(Math.random() * (max - min + 1)) + min;
    res.sendFile(path.resolve(__dirname + '/static/img/test_dataset/' + rand + '.png'))
}) 

app.post('/upload', async (request, result) => {

    let image = request.files.img;

    try {
        // update > image with defects highlighted
        await fetch(api + "api/detail", {
            mode: 'cors',
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "multipart/form-data"
            },
            body: image.data
        })

        // require > status, defect rate
        let req = await fetch(api + "api/detect", {
            mode: 'cors',
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "multipart/form-data"
            },
            body: image.data
        })

        // receive > data | redirect > back
        let res = await req.json()
        console.log(res)
        let status = res.Status
        let percent = await res.percent
        result.redirect(front + 'zoneB?status=' + status + '&percent=' + percent)

    } catch(err) {
        console.log('error occured:', err);
    }


})

app.post('/getimg', async (request, result) => {

    let image = request.files.img;

    try {
        let req = await fetch(api + "api/detail", {
            mode: 'cors',
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "multipart/form-data"
            },
            body: image.data
        })

        result.redirect(front + 'zoneC?state=received')
    } catch(err) {
        console.log('error occured:', err);
    }

})

app.listen(4000);