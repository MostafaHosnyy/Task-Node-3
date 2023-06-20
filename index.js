const express = require("express");
const app = express();
const axios = require("axios");
const cc = require("currency-converter-lt");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/products", (req, res, next) => {
  const curr = req.query.CUR;
  if (!curr) { return res.json({ message: "Type error , one the arguments was wrong , try again", });}

  getData(curr).then((response) => { return res.json({ Data: response, });

});
});

const getData = async (curr) => {
  const data = await axios.get("https://api.escuelajs.co/api/v1/products");
  if (data.status === 200) {
    let productConainer = [];
    productConainer = Object.entries(data["data"]);
    console.log(productConainer);
    let currencyConverter = new cc();
    productConainer.forEach((el) => { currencyConverter
        .from("USD") .to(curr) .amount(el[1].price) .convert() .then((result) => {
          el[1].price = result;
          console.log(result);
        });
    });
    return productConainer;
  }
};

app.post("/products", (req, res, next) => {
  const title = req.body.title;
  const categoryId = req.body.categoryId;
  const price = req.body.price;
  const description = req.body.description;
  const images = req.body.images;

  if (!title || !description || !price || !categoryId || !images) {
    return res.json({message: "Something went wrong, maybe you put wrong data",});}

  const data = {
    title: title,
    categoryId: categoryId,
    price: price,
    images: images,
    description: description,
  };

  axios
    .post("https://api.escuelajs.co/api/v1/products/",
     data).then((response) => {
      console.log(response["data"]);
    })
    .catch((err) => {
      console.log(err);
    });
});


app.listen(8080);