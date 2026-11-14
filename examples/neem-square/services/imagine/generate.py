"""Imagine: text-to-image and photo editing."""
import uuid

from services import flags, quota
from services.imagine import model, provenance, safety
from services.imagine.label import burn_in


def _finish(image, user, mode):
    asset_id = str(uuid.uuid4())
    label = flags.get("imagine.label")
    clean = flags.get("creators.clean_export") and user.is_verified_creator
    if label["burn_in"] and not clean:
        image = burn_in(image, text=label["text"], position=label["position"])
    image = provenance.write(image, asset_id=asset_id, mode=mode)
    return {"asset_id": asset_id, "image": image, "labelled": not clean}


def text_to_image(prompt, user):
    quota.spend(user, "imagine")
    safety.check_prompt(prompt, user)
    image = model.generate(prompt)
    safety.check_output(image)
    return _finish(image, user, mode="text_to_image")


def image_to_image(source_image, instruction, user):
    """Edit an uploaded photo: restyle, swap a background, change what someone is wearing or doing."""
    quota.spend(user, "imagine")
    image = model.edit(source_image, instruction)
    return _finish(image, user, mode="image_to_image")
