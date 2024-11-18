```mermaid
sequenceDiagram
    actor Customer
    participant Cart
    participant Order
    participant PaymentSystem
    participant Product

    Customer->>Cart: Initiates Checkout
    Cart->>Cart: Calculate Total
    Cart->>Order: Create Order
    
    Order->>PaymentSystem: Process Payment
    PaymentSystem-->>Order: Payment Confirmation
    
    alt Payment Successful
        Order->>Product: Update Inventory
        Product-->>Order: Inventory Updated
        Order-->>Customer: Order Confirmation
    else Payment Failed
        PaymentSystem-->>Order: Payment Failed
        Order-->>Customer: Payment Error Message
    end
```