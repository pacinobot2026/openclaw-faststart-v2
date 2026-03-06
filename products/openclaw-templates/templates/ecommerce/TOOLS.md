# TOOLS.md - E-Commerce Agent Tools

This file documents your integrations, credentials, and platform-specific notes.

---

## 🛒 E-Commerce Platform

**Platform:** [Shopify | WooCommerce | Custom]  
**Store URL:** [your-store.com]  
**Admin Panel:** [admin URL]

### API Access
- **API Key:** [stored in credentials/ecommerce-api.txt]
- **Base URL:** [https://your-store.com/api]
- **Documentation:** [link to API docs]

### Common Operations
- **Get Order:** `GET /orders/{order_id}`
- **Update Order:** `PUT /orders/{order_id}`
- **Process Refund:** `POST /orders/{order_id}/refunds`
- **Check Inventory:** `GET /products/{product_id}/inventory`

---

## 📦 Shipping & Tracking

### Carriers Used
- USPS
- UPS
- FedEx
- [Add your carriers]

### Tracking APIs
- **USPS:** [API key in credentials]
- **UPS:** [API key in credentials]
- **Multi-carrier tracker:** [service you use]

### Return Labels
- **Service:** [Shippo | EasyPost | Built-in]
- **Auto-generate:** [Yes/No]
- **Cost:** [Free | Customer pays | Conditional]

---

## 💳 Payment & Refunds

### Payment Processor
- **Processor:** [Stripe | PayPal | Square]
- **Dashboard:** [dashboard URL]

### Refund Policy (MEMORIZE THIS!)
- **Window:** [30 days | 60 days | custom]
- **Conditions:** [Unused | Original packaging | etc.]
- **Exceptions:** [Final sale items, custom products]
- **Process:** [Full refund | Store credit | Exchange]

### Refund Limits
- **Auto-approve:** Up to $[amount]
- **Requires approval:** Over $[amount]
- **Owner notification:** Always for amounts > $[threshold]

---

## 📧 Email / Notifications

### Customer Communication
- **From address:** support@your-store.com
- **Templates:** See `templates/` folder
- **Signature:** [Your signature block]

### Owner Notifications
- **Urgent issues:** [SMS | Telegram | Email]
- **Daily summary:** [Email at 9am]
- **Weekly report:** [Monday morning]

---

## 📊 Analytics & Reporting

### Metrics to Track
- Response time (goal: < 5 min average)
- Customer satisfaction
- Refund rate
- Common questions (for FAQ)
- Escalation frequency

### Tools
- **Dashboard:** [your analytics tool]
- **Export:** [how to pull reports]

---

## 🤖 Automation Workflows

### Abandoned Cart Recovery
- **Trigger:** Cart inactive for 3 hours
- **Email sequence:** 3 emails (3h, 24h, 48h)
- **Discount:** 10% off code on email 3

### Post-Purchase Follow-up
- **Day 1:** Thank you + tracking info
- **Day 7:** "How's it going?" check-in
- **Day 14:** Request review (if positive experience)

### Low Stock Alerts
- **Threshold:** When inventory < [X units]
- **Notify:** Owner + flag in daily summary
- **Auto-reorder:** [Yes/No, service used]

---

## 📚 Product Knowledge

### Categories
- [Category 1]: [Key products, common questions]
- [Category 2]: [Key products, common questions]
- [Category 3]: [Key products, common questions]

### Sizing / Compatibility
- [Sizing charts location]
- [Compatibility matrices]
- [Common fit issues]

### Warranties / Guarantees
- **Standard warranty:** [duration, coverage]
- **Extended options:** [if available]
- **Claims process:** [how customers file]

---

## 🔧 Troubleshooting

### Common Issues

**1. "Where's my order?"**
- Check order status in system
- Provide tracking if shipped
- Explain processing time if not shipped

**2. "Wrong item received"**
- Verify order details
- Arrange return + replacement
- Expedite shipping on replacement

**3. "Item damaged in shipping"**
- Request photo evidence
- File carrier claim if needed
- Send replacement immediately

**4. "Tracking says delivered but I didn't get it"**
- Check delivery confirmation details
- Suggest checking neighbors/mailroom
- File carrier claim
- Reship if needed

---

## 🚨 Emergency Contacts

**Owner:** [phone, preferred contact method]  
**Warehouse:** [contact for urgent shipping issues]  
**Developer:** [for website/tech issues]  
**Accountant:** [for billing/refund questions]

---

## 📝 Notes

Add store-specific details:
- Busy seasons (holiday prep)
- Product launch schedules
- Known issues
- Customer preferences
- Lessons learned

Update this file as you learn what works!
