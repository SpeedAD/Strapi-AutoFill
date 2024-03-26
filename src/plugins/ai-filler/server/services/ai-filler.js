"use strict";

const { faker } = require("@faker-js/faker");

module.exports = ({ strapi }) => ({
  getWelcomeMessage() {
    return "Welcome to Strapi 🚀";
  },

  async fillData() {
    console.log("Started filling data...");
    const contentTypes = strapi.contentTypes;
    const customContentTypes = Object.keys(contentTypes)
      .filter(
        (key) =>
          !contentTypes[key].plugin && // exclude content types from plugins
          (contentTypes[key].kind === "collectionType" ||
            contentTypes[key].kind === "singleType") // include only collection and single types
      )
      .reduce((obj, key) => {
        obj[key] = contentTypes[key];
        return obj;
      }, {});

    for (const [key, contentType] of Object.entries(customContentTypes)) {
      console.log(`Generating data for content type: ${key}`);
      const data = await this.generateDataForModel(contentType);
      try {
        console.log(`Inserting data into content type: ${key}`);
        await strapi.entityService.create(key, { data });
        console.log(`Successfully inserted data into content type: ${key}`);
      } catch (error) {
        console.error(`Error creating entry for content type: ${key}:`, error);
        if (error.details && error.details.errors) {
          error.details.errors.forEach((e, index) => {
            console.error(`Error ${index + 1} for content type: ${key}:`, e);
          });
        }
      }
    }
    console.log("Completed filling data.");
  },

  async generateDataForModel(contentType) {
    console.log(
      `Generating data model for: ${contentType.globalId || "unknown type"}`
    );
    const entry = {};
    for (const [fieldName, fieldDetails] of Object.entries(
      contentType.attributes
    )) {
      switch (fieldDetails.type) {
        case "string":
          entry[fieldName] = faker.lorem.sentence();
          break;
        case "uid":
          let text = faker.lorem.words(3);
          entry[fieldName] = text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-_.~]/g, "");
          break;
        case "text":
          entry[fieldName] = faker.lorem.paragraph();
          break;

        case "integer":
          if (fieldName === "percentage_value") {
            entry[fieldName] = faker.number.int({ min: 0, max: 100 });
          } else {
            const min = fieldDetails.min || 0;
            const max = fieldDetails.max || 1000;
            entry[fieldName] = faker.number.int({ min, max });
          }
          break;

        case "boolean":
          entry[fieldName] = faker.datatype.boolean();
          break;

        case "date":
          entry[fieldName] = faker.date.past().toISOString().split("T")[0]; // format: YYYY-MM-DD
          break;

        case "datetime":
          entry[fieldName] = faker.date.recent().toISOString(); // ISO 8601 format
          break;

        // case "relation":
        //   // Placeholder for relations.
        //   entry[fieldName] = 1; // You might want to set this to an existing related entry ID.
        //   break;

        // case "media":
        //   // Placeholder for media fields.
        //   entry[fieldName] = 1; // Set this to the ID of uploaded media after handling file uploads.
        //   break;

        case "component":
          if (fieldDetails.repeatable) {
            const componentsCount = faker.number.int({ min: 0, max: 5 });
            entry[fieldName] = [];
            for (let i = 0; i < componentsCount; i++) {
              const componentData = await this.generateDataForModel(
                strapi.components[fieldDetails.component]
              );
              componentData.__component = fieldDetails.component;
              entry[fieldName].push(componentData);
            }
          } else {
            const componentData = await this.generateDataForModel(
              strapi.components[fieldDetails.component]
            );
            componentData.__component = fieldDetails.component;
            entry[fieldName] = componentData;
          }
          break;
        // break;

        case "dynamiczone":
          entry[fieldName] = [];
          for (const componentType of fieldDetails.components) {
            const componentData = await this.generateDataForModel(
              strapi.components[componentType]
            );
            componentData.__component = componentType;
            entry[fieldName].push(componentData);
          }
          break;

        case "json":
          entry[fieldName] = {
            key: faker.lorem.word(),
            value: faker.lorem.sentence(),
            items: [faker.number.int(), faker.number.int()],
          };
          break;

        default:
          console.log(
            `No data generation handler for field type: ${fieldDetails.type}`
          );
          break;
      }
    }
    console.log(
      `Generated data model for: ${contentType.globalId || "unknown type"}`
    );
    return entry;
  },
});
