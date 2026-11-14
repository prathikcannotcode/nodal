# Neem Square compliance report: {{ period }}

Published under rule 4(1)(d) of the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.

## Complaints from users in India

| | Count |
|---|---|
| Complaints received | {{ complaints_received }} |
| Complaints where we took action | {{ complaints_actioned }} |
| Complaints where we took no action | {{ complaints_not_actioned }} |

### By category

{% for category, count in complaints_by_category.items() %}
- {{ category }}: {{ count }}
{% endfor %}

## Proactive monitoring

Posts and links removed after detection by our automated tools: {{ proactive_removals }}

## Orders

Items removed on a court order or government notice: {{ orders_received }}

Earlier reports are in the archive below.
