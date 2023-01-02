# Insiflix API protocol

**Base URL:** `https://api.insiflix.com`

## Login with username and password

**URL:** `/auth/login`

**Method:** `POST`

**Credentials required:** `yes`

**JSON data:**

- `enteredName` (string, required)
- `enteredPassword` (string, required)

### Success Response

**Code:** `200 OK`

## Validate current login

**URL:** `/auth/validate`

**Method:** `GET`

**Credentials required:** `yes`

### Success Response

**Code:** `200 OK`

### Success Response

**Code:** `200 OK`

## Get random recommandations

**URL:** `/recommandations/random`

**Method:** `GET`

**Credentials required:** `yes`

**QUERY data:**

- `amount` (number,)

### Success Response

**Code:** `200 OK`

## Get most recent videos

**URL:** `/recommandations/recent`

**Method:** `GET`

**Credentials required:** `yes`

**QUERY data:**

- `amount` (number)

### Success Response

**Code:** `200 OK`

## Get videos by tags

**URL:** `/recommandations/tags`

**Method:** `GET`

**Credentials required:** `yes`

**QUERY data:**

- `tag` (string, required)
- `amount` (number)

### Success Response

**Code:** `200 OK`

## Add video via youtube link

**URL:** `/upload/yt`

**Method:** `POST`

**Credentials required:** `yes`

**JSON data:**

- `url` (string, required)
- `tags` (string, required)

### Success Response

**Code:** `200 OK`

## Add video via file upload

**URL:** `/upload/file`

**Method:** `POST`

**Credentials required:** `yes`

**JSON data:**

- `video` (file, required)
- `thumbnail` (file)
- `title` (text, required)
- `tags` (text, required)
- `creator` (text, required)

### Success Response

**Code:** `200 OK`

## Stream video

**URL:** `/videos/watch/:id`

**Method:** `GET`

**Credentials required:** `yes`

### Success Response

**Code:** `200 OK`

## Get thumbnail image

**URL:** `/img/:id`

**Method:** `GET`

**Credentials required:** `yes`

### Success Response

**Code:** `200 OK`
