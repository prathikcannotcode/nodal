"""POST /api/posts: create a post from an upload or from an Imagine result."""
from services import db, storage
from services.imagine import assets
from services.media import pipeline


def create_post(user, form, files):
    if form.get("imagine_asset_id"):
        image = assets.load(form["imagine_asset_id"], owner=user)
        source = "imagine"
    else:
        image = files["media"].read()
        source = "upload"

    renditions = pipeline.prepare_for_feed(image)
    media_id = storage.put_renditions(renditions)

    return db.insert("posts", {
        "author_id": user.id,
        "media_id": media_id,
        "caption": form.get("caption", ""),
        "audience": form.get("audience", "public"),
        "allow_comments": bool(form.get("allow_comments")),
        "source": source,
        "status": "live",
    })
