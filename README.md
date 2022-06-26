# client-dashboard

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Extra information

### Vue2

### UI

- made with Vuetify https://vuetifyjs.com/en/

### Icons

- materialdesignicons.com
- https://icofont.com/icons

### Environment Variables

the project needs to have

- VUE_APP_URL=url_of_dev_backend
- VUE_APP_HOST_URL=url_of_where_this_app_is_hosted
- VUE_APP_EMAIL_ENV=test_email_environment : if the value is `development`, it will send test emails. Set to `production` if you don't want to send the test emails

i.e.

```
VUE_APP_URL=http://localhost:5000
VUE_APP_HOST_URL=http://localhost:8080
VUE_APP_EMAIL_ENV=development
```

### Auth0 HTML templates

Change password page - src/auth-html/reset-password.html
https://manage.auth0.com/dashboard/us/easy-evictions/password_reset

Login page - src/auth-html/login-signup.html
https://manage.auth0.com/dashboard/us/easy-evictions/login_page

### Auth0 HTML email templates

src/emails
https://manage.auth0.com/dashboard/us/easy-evictions/templates
