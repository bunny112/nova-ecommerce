FROM php:8.4-apache

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    curl \
    nodejs \
    npm \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl pdo_mysql mbstring zip \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN npm install
RUN npm run build

RUN cp .env.example .env || true
RUN php artisan key:generate --force
RUN php artisan storage:link || true

RUN chown -R www-data:www-data storage bootstrap/cache

RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|' /etc/apache2/sites-available/000-default.conf

RUN sed -i '/<Directory \\/var\\/www\\/>/,/<\\/Directory>/c\
<Directory /var/www/html/public>\
    AllowOverride All\
    Require all granted\
</Directory>' /etc/apache2/apache2.conf

EXPOSE 80

CMD ["apache2-foreground"]