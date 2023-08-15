# TDAS Server

### Requirements

- Node.js https://nodejs.org/en/download/
- Yarn https://classic.yarnpkg.com/lang/en/docs/install/

## Getting Started

### Update/install dependencies

`yarn install`

### Start the app

`yarn start`

## API Usage

| URL              | Type   | Params | Return Value on Success | Return Value on Error   |
| ---------------- | ------ | ------ | ----------------------- | ----------------------- |
| /api/data/upload | `POST` | File   | `{ testId: _id }`       | `{ testId: undefined }` |
| /api/data/upload | `POST` | File   | `{ testId: _id }`       | `{ testId: undefined }` |
