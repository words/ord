#!/usr/bin/env node
const { get } = require('lodash')
const wikipedias = require('wikipedias')

function geojsonify (translations) {
  const features = []

  for (const translation of translations) {
    const wikipedia = wikipedias[translation.lang]
    const countries = get(wikipedia, 'languageData.countries', [])
    for (const country of countries) {
      if (!country.coordinates) continue
      const feature = {
        type: 'Feature',
        properties: {
          ...translation,
          country: country
        },
        geometry: {
          type: 'Point',
          coordinates: country.coordinates
        }
      }
      features.push(feature)
    }
  }

  return {
    type: 'FeatureCollection',
    features
  }
}

module.exports = geojsonify
