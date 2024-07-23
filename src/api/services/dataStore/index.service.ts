import fs from "fs";
import path from "path";
import { Product } from "@api/models";

export class DataStore {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async initialize(): Promise<number> {
    const dirPath = path.dirname(this.filePath);
    !fs.existsSync(dirPath) && fs.mkdirSync(dirPath, { recursive: true });
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
      return 0;
    } else {
      const data = await fs.promises.readFile(this.filePath, "utf8");
      const products: Product[] = JSON.parse(data);
      return products.reduce(
        (max: number, p: Product) => (p.id > max ? p.id : max),
        0
      );
    }
  }
}
