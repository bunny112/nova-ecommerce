FROM dunglas/frankenphp:php8.4-bookworm

WORKDIR /app

RUN install-php-extensions \
    pdo_mysql \
    pdo_sqlite \
    mbstring \
    bcmath \
    intl \
    zip \
    opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

RUN npm install
RUN npm run build

EXPOSE 10000

CMD ["php", "artisan", "octane:frankenphp", "--host=0.0.0.0", "--port=10000"]