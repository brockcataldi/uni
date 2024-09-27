# University Enrollment System

## Considerations

For time constraints I went with a code duplication rather than overt abstraction. 
I feel as if it's easier to diagnose with duplication, and if I were to refine this, I'd abstract significantly more.

## Required Software

```
docker: latest
node v22.8.0
npm v10.8.3
```

## Commands

To start the database. 
```bash
docker-compose up
```

To run a development server.
```bash
npm run dev
```

To build the system.
```bash
npm run build
```

To serve the built files
```bash
npm run start
```

## URLs

http://localhost:3000/docs - Swagger (Testing and Documentation)
http://localhost:8080 - phpMyAdmin (If you want to look at the Database)