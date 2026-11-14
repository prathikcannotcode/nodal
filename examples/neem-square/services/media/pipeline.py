"""Prepares every image for the feed and the CDN."""
from services.media import codec

MAX_EDGE = 2048
SIZES = {"thumb": 320, "feed": 1080, "full": MAX_EDGE}


def prepare_for_feed(image):
    """Runs on every post, whatever its source."""
    image = codec.orient(image)
    image = codec.drop_metadata(image)      # EXIF, XMP, IPTC: keeps GPS and device details off the CDN
    renditions = {name: codec.resize(image, edge) for name, edge in SIZES.items()}
    return {name: codec.encode_webp(rendition, quality=82) for name, rendition in renditions.items()}
