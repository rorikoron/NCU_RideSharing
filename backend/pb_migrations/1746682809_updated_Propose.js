/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2358664717")

  // remove field
  collection.fields.removeById("number1692803247")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2358664717")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number1692803247",
    "max": null,
    "min": null,
    "name": "headcount",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
