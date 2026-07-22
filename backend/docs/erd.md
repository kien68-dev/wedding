# ERD - Web Wedding Manager

## Core entities

- User
  - id
  - email
  - passwordHash
  - name
  - role
  - isActive

- Customer
  - id
  - fullName
  - phone
  - email
  - citizenId
  - address
  - notes

- Couple
  - id
  - brideName
  - groomName
  - birthDate
  - profession
  - photoUrl
  - facebook
  - notes

- Venue
  - id
  - name
  - capacity
  - price
  - status
  - imageUrl

- TableSetting
  - id
  - tableNumber
  - capacity
  - price
  - status

- Menu
  - id
  - appetizer
  - mainCourse
  - dessert
  - beverage
  - imageUrl

- Service
  - id
  - name
  - description
  - price

- WeddingEvent
  - id
  - eventDate
  - eventTime
  - venueId
  - customerId
  - menuId
  - serviceId
  - status
  - totalAmount
  - depositAmount

- Guest
  - id
  - name
  - phone
  - email
  - tableNumber
  - status
  - weddingEventId

- Contract
  - id
  - customerId
  - totalValue
  - depositAmount
  - status
  - pdfUrl

- Payment
  - id
  - eventId
  - amount
  - type
  - status
  - transactionDate

## Relationships

- Customer 1 --- * WeddingEvent
- Venue 1 --- * WeddingEvent
- Menu 1 --- * WeddingEvent
- Service 1 --- * WeddingEvent
- WeddingEvent 1 --- * Guest
- WeddingEvent 1 --- * Payment
- Customer 1 --- * Contract

## Mermaid diagram

```mermaid
erDiagram
    CUSTOMER ||--o{ WEDDING_EVENT : books
    VENUE ||--o{ WEDDING_EVENT : hosts
    MENU ||--o{ WEDDING_EVENT : uses
    SERVICE ||--o{ WEDDING_EVENT : includes
    WEDDING_EVENT ||--o{ GUEST : invites
    WEDDING_EVENT ||--o{ PAYMENT : has
    CUSTOMER ||--o{ CONTRACT : signs

    CUSTOMER {
        int id PK
        string fullName
        string phone
        string email
        string citizenId
        string address
        string notes
    }

    VENUE {
        int id PK
        string name
        int capacity
        decimal price
        string status
        string imageUrl
    }

    MENU {
        int id PK
        string appetizer
        string mainCourse
        string dessert
        string beverage
        string imageUrl
    }

    SERVICE {
        int id PK
        string name
        string description
        decimal price
    }

    WEDDING_EVENT {
        int id PK
        datetime eventDate
        string eventTime
        int venueId FK
        int customerId FK
        int menuId FK
        int serviceId FK
        string status
        decimal totalAmount
        decimal depositAmount
    }

    GUEST {
        int id PK
        string name
        string phone
        string email
        int tableNumber
        string status
        int weddingEventId FK
    }

    CONTRACT {
        int id PK
        int customerId FK
        decimal totalValue
        decimal depositAmount
        string status
        string pdfUrl
    }

    PAYMENT {
        int id PK
        int eventId FK
        decimal amount
        string type
        string status
        datetime transactionDate
    }
```
