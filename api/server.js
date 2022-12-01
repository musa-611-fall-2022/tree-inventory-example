import express from 'express';
import fs from 'node:fs/promises';
import cors from 'cors';
import * as turf from '@turf/turf';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
const port = 3000;
app.use(cors());

app.post('/ll/:lng/:lat', async (req, res) => {
  // Use the lat and lng to find the trees within 100 meters
  // in the tree-inventory feature collection.

  const fileContent = await fs.readFile(`${__dirname}/data/tree-inventory.geojson`);
  const data = JSON.parse(fileContent);

  const features = [];
  const center = turf.point([
    parseFloat(req.params.lng),
    parseFloat(req.params.lat),
  ]);

  for (const feature of data.features) {
    const featurePoint = turf.point(feature.geometry.coordinates);
    const distance = turf.distance(center, featurePoint);
    if (distance <= 0.1) {
      features.push(feature);
    }
  }

  const newData = {
    type: 'FeatureCollection',
    features: features,
  };

  res.json(newData);
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
