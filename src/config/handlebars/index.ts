import { Express } from "express";
import { engine } from "express-handlebars";
import path from "path";
import Handlebars from "handlebars";

export function setupHandlebars(app: Express) {
  Handlebars.registerHelper("firstThumbnail", function (thumbnails: string[]) {
    return thumbnails[0];
  });

  app.engine(
    "handlebars",
    engine({
      defaultLayout: "home",
      layoutsDir: path.join(__dirname, "../../views/layouts"),
    })
  );
  app.set("view engine", "handlebars");
  app.set("views", path.join(__dirname, "../../views/layouts"));
}
