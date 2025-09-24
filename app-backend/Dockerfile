# app-backend/Dockerfile
FROM php:8.2-cli

ENV DEBIAN_FRONTEND=noninteractive

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libzip-dev libpng-dev libxml2-dev libonig-dev pkg-config \
 && rm -rf /var/lib/apt/lists/*

# QNAP tar wrapper to avoid "Bad address"
RUN printf '#!/bin/sh\nexec /usr/bin/tar --no-same-owner --no-same-permissions "$@"\n' \
    > /usr/local/bin/tar && chmod +x /usr/local/bin/tar

# PHP extensions
RUN docker-php-ext-configure zip \
 && docker-php-ext-install -j"$(nproc)" pdo_mysql mbstring zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . /var/www/html

RUN composer install --no-interaction --prefer-dist --no-dev \
 && mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache || true \
 && php -r "file_exists('.env') || copy('.env.example', '.env');" \
 && php artisan key:generate || true

EXPOSE 8011
CMD ["php","artisan","serve","--host=0.0.0.0","--port=8011"]
