const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const monk = require('monk');
const yup = require('yup');
const { nanoid } = require('nanoid');

require('dotenv').config()

const app = express();
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

const db = monk(process.env.MONGO_URI);
const urls = db.get('urls');
urls.createIndex({ slug: 1 }, { unique: true });

const schema = yup.object().shape({
  slug: yup.string().trim().matches(/[\w\-]/i),
  url: yup.string().trim().url().required()
});

app.get('/:id', async (req, res, next) => {
  const { id: slug } = req.params;

  try {
    console.log(slug);
    const obj = await urls.findOne({ slug });

    if (obj) {
      res.redirect(obj.url);
    }
    else {
      res.redirect(`/?error=${slug} not found.`)
    }
  }
  catch (error) {
    next(error)
  }
})

app.post('/url', async (req, res, next) => {
  let { slug, url } = req.body;
  try {
    if (!slug) {
      slug = nanoid(8);
    }
    else {
      const exists = await urls.findOne({ slug });
      if (exists) {
        throw new Error('Slug being used');
      }
    }

    slug = slug.toLowerCase();
    const object = {
      slug,
      url
    }

    await schema.validate(object)

    const entry = await urls.insert(object)
    res.json(entry)
  }
  catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status)
  } else {
    res.status(500);
  }

  res.json({
    message: error.message,
    stack: error.stack
  })
})

const port = process.env.PORT || 1000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});