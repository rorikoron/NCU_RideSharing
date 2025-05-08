/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2358664717")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number1626338779",
    "max": null,
    "min": null,
    "name": "headcount_limit",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2358664717")

  // remove field
  collection.fields.removeById("number1626338779")

  return app.save(collection)
})
