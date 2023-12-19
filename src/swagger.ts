import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
  },
  apis: ["./routes/**/*.ts"], // Update this to match your route files
};

const specs = swaggerJsDoc(options);

export default (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
