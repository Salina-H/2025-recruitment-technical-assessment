import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: any = [];

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  } 
  res.json({ msg: parsed_string });
  return;
  
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const parse_handwriting = (recipeName: string): string | null => {
  recipeName = recipeName.replace(/-/g, ' ');
  recipeName = recipeName.replace(/_/g, ' ');

  recipeName = recipeName.replace(/[^A-Za-z ]/g, '');
  recipeName = recipeName.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
  
  recipeName = recipeName.replace(/\s+/g, ' ').trim();

  return recipeName.length > 0 ? recipeName : null;
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req:Request, res:Response) => {
  const entry = req.body;

  // Validate entry type
  if (!entry.type || !['recipe', 'ingredient'].includes(entry.type)) {
      res.status(400).send('Invalid type');
  }

  // Validate unique names
  if (cookbook.some(existingEntry => existingEntry.name === entry.name)) {
      res.status(400).send('Entry names must be unique' );
  }

  if (entry.type === 'ingredient') {
      // Validate cookTime
      if (entry.cookTime === undefined || entry.cookTime < 0) {
          res.status(400).send('Invalid cookTime');
      }
  } else if (entry.type === 'recipe') {
      // Validate requiredItems
      if (!Array.isArray(entry.requiredItems)) {
          res.status(400).send('Invalid requiredItems');
      }
      
      const itemNames = new Set<string>();
      for (const item of entry.requiredItems) {
          if (!item.name || item.quantity === undefined) {
              res.status(400).send('Invalid required item format');
          }
          if (itemNames.has(item.name)) {
              res.status(400).send('Recipe requiredItems can only have one element per name');
          }
          itemNames.add(item.name);
      }
  }

  // Add the valid entry to the cookbook
  cookbook.push(entry);

  res.status(200).send("");
  return;
});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res:Response) => {
  // TODO: implement me
  res.status(500).send("not yet implemented!")
});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
