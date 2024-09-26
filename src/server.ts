import { tableExists, query } from "./database";
import {
  CREATE_TABLE_COURSES,
  CREATE_TABLE_ENROLLMENTS,
  CREATE_TABLE_GRADES,
  CREATE_TABLE_PROFESSORS,
  CREATE_TABLE_STUDENTS,
} from "./queries";

import config from "../config.json";

export async function initialize() {
  // I am having a moral conundrum between
  // the look of doing this via a for-loop
  // and handwriting if else statements
  // this might be the cleaner options

  if (!(await tableExists("students"))) {
    console.log(await query(CREATE_TABLE_STUDENTS));
  }
  if (!(await tableExists("professors"))) {
    console.log(await query(CREATE_TABLE_PROFESSORS));
  }
  if (!(await tableExists("courses"))) {
    console.log(await query(CREATE_TABLE_COURSES));
  }
  if (!(await tableExists("enrollments"))) {
    console.log(await query(CREATE_TABLE_ENROLLMENTS));
  }
  if (!(await tableExists("grades"))) {
    console.log(await query(CREATE_TABLE_GRADES));
  }

  console.log(
    `[server]: Server is running at http://localhost:${config.server.port}`,
  );
}
