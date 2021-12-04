
const express = require('express');
const app = express();
const cors = require('cors');
const upload = require('express-fileupload');
const fetch = require('cross-fetch');


app.set('view engine', 'ejs');  

app.use(cors());
app.use(upload());


app.post('/upload', async (request, result) => {

    let image = request.files.img;
    //console.log(image.data);

    try {

        // update > image with defects highlighted
        await fetch("https://final.teambolognese.ru/api/detail", {
            mode: 'cors',
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "multipart/form-data"
            },
            body: image.data
        })

        // require > status, defect rate
        let req = await fetch("https://final.teambolognese.ru/api/detect", {
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
        let status = res.Status
        let percent = await res.percent
        result.redirect('http://localhost:3000/zoneB?status=' + status + '&percent=' + percent)

    } catch(err) {
        console.log('error occured:', err);
    }


})

app.post('/getimg', async (request, result) => {

    let image = request.files.img;
    //console.log(image.data);

    try {
        let req = await fetch("https://final.teambolognese.ru/api/detail", {
            mode: 'cors',
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "multipart/form-data"
            },
            body: image.data
        })

        result.redirect('http://localhost:3000/zoneC?state=received')
    } catch(err) {
        console.log('error occured:', err);
    }

})

app.listen(3333);