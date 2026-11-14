"""Provenance metadata for Imagine output, written as XMP."""
from services.media import xmp

GENERATOR = "neem-square-imagine/3"


def write(image, asset_id, mode):
    return xmp.set_fields(image, {
        "neem:generator": GENERATOR,
        "neem:asset_id": asset_id,
        "neem:mode": mode,
        "dc:description": "AI-generated image",
    })


def read(image):
    return xmp.get_fields(image, prefix="neem:")
