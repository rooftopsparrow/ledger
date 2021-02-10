# Database

The database for this project is [PostgreSQL][postgresql]

- The `migrations` directory contains migrations required
for the application

**Tasks**:

```
# List all tasks
task --list
# Migrate
task migrate
```

**MANUAL**:

**TODO**: Figure out auto-migrations on k8s cluster

```sh
go run migrations/*.go
```

[postgresql]: https://www.postgresql.org
