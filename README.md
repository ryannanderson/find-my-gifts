# Project Midterm

### Deployed Website

https://find-my-gifts.herokuapp.com/

## Resource

Gifts Attributes

- Name (string)
- Idea (string)
- Price (number)
- Date (Date)
- Purchased (Boolean)

User Attributes

- First Name (string)
- Email (string)
- Password (string)

Session Attributes

- Email (string)
- Password (string)

## REST Endpoints

| Name                      | Method | Path       |
| ------------------------- | ------ | ---------- |
| Retrieve gifts Collection | GET    | /gifts     |
| Retrieve gift             | GET    | /gifts/:id |
| Create gift               | POST   | /gifts     |
| Delete gift               | DELETE | /gifts/:id |
| Edit gift                 | PUT    | /gifts/:id |
| Edit gift                 | PATCH  | /gifts/:id |
| Create user               | POST   | /users     |
| Retrive sessions          | GET    | /sessions  |
| Create session            | POST   | /sessions  |
| Delete session            | DELETE | /sessions  |
