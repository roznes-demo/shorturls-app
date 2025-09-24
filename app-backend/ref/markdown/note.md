###### backend

# Getting Stated
[create-project]
```sh
composer create-project laravel/laravel backend
cd backend
php artisan serve
```

[install-requirements]
```sh
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan make:middleware CheckRoleAndStatus
php artisan make:middleware TokenExpirationMiddleware
php artisan make:controller UserAuthController

php artisan make:controller RoleAController
php artisan make:controller RoleBController
php artisan make:controller RoleCController

# api: crud
# php artisan make:controller Api/ProductController
php artisan make:controller Api/URLController

# api: others
php artisan make:controller Api/ShortURLController

# web
php artisan make:controller Web/RedirectController

```

<!-- ############################## DEV.START ############################## -->
# run
```sh
composer install
php artisan key:generate
php artisan storage:link
php artisan config:cache

php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# .env updated
# composer dump-autoload

# local
php artisan serve

# network access
php artisan serve --host=0.0.0.0 --port=8000
```

# database
[migration]
```sh
# migrate
php artisan migrate
```
<!-- ############################## DEV.END ############################## -->

# sql
[users]
```sql
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `remember_token` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `role` VARCHAR(255) NOT NULL DEFAULT '0',  -- 0:a, 1:b, 2:c
  `status` VARCHAR(255) NOT NULL DEFAULT 'active',  -- active, inactive
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

[products]
```sql
-- CREATE TABLE IF NOT EXISTS `products` (
--   `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
--   `name` VARCHAR(255) NULL COMMENT 'Name',
--   `description` TEXT NULL COMMENT 'Description',
--   `price` DECIMAL(10, 2) NULL COMMENT 'Price value',
--   `quantity` INT(11) NULL COMMENT 'Quantity value',
--   `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the record was created',
--   `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when the record was last updated',
--   `status` VARCHAR(255) NOT NULL DEFAULT 'active' COMMENT 'Record status: active or inactive',
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

[urls ]
```sql
CREATE TABLE IF NOT EXISTS `urls` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_url` TEXT NOT NULL,
  `code` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` VARCHAR(255) NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```