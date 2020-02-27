## Features

- list of alliances
- add an alliance
- list alliance's countries
- list of countries
- add a country
- list a country's alliances

| Feature                   | Method | URL                          |
| :------------------------ | :----- | :--------------------------- |
| List of Alliances         | GET    | /api/alliances               |
| Add an Alliance           | POST   | /api/alliances               |
| View Alliance's Countries | GET    | /api/alliances/:id/countries |
| List of Countries         | GET    | /api/countries               |
| Add a Country             | POST   | /api/countries               |
| View Country's Alliances  | GET    | /api/students/:id/alliances  |

## Alliances

- id
- name
- formation date

## Countries

- id
- name
- population

## Testing

- functions: invoke the function with optional arguments, then check results
- endpoints: make a request with optional arguments, then check response