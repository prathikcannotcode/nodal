"""URL map for the web app. Templates live in web/templates, legal text in web/legal."""
from web.render import page, markdown_page

ROUTES = {
    "/": page("home.html"),
    "/terms": markdown_page("legal/terms.md"),
    "/privacy": markdown_page("legal/privacy.md"),
    "/guidelines": markdown_page("legal/community-guidelines.md"),
    "/contact": page("contact.html"),
    "/help": page("help.html"),
    "/help/legal": page("legal_index.html"),
    "/help/legal/grievance": page("grievance.html"),
    "/help/report": page("report.html"),
    "/transparency": page("transparency.html"),
    "/new": page("upload.html"),
    "/imagine": page("imagine.html"),
}
