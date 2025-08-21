# Expense Splitter App - Requirements

## ⏳ To Do

### Database

- [x] Setup Drizzle ORM with SQLite

### Auth

- [x] Integrate BetterAuth for authentication
- [x] Implement Google SSO for user login

### Group Management

- [x] Create group functionality to manage shared expenses
- [ ] Add ability to invite/add new users to a group
- [ ] Remove users from a group (with safeguards, e.g., if they still owe money)

### Expense Management

- [ ] Add new expenses to a group (support metadata: description, amount, payer, timestamp)
- [ ] Track how expenses are split among group members
- [ ] Record expenses owed by each member
- [ ] Mark owed expenses as **paid** (update balances accordingly)

### Smart Features (LLM Integration)

- [ ] Integrate LLM to interpret natural language commands (e.g., “Add ₹500 for dinner last night, split among A, B, C”)
- [ ] Support querying balances in plain language (e.g., “How much does Omkar owe in Group X?”)

## 🚀 Future Enhancements (Optional)

- [ ] Notifications (email/Slack/WhatsApp) for new expenses or owed amounts  
- [ ] Dashboard with charts (total spent, balances, settlements)  
- [ ] Multi-currency support  
- [ ] Export group balances/expenses to CSV or PDF  

