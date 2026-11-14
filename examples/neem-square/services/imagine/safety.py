"""Prompt and output checks for Imagine."""
from services.imagine import classifier

BLOCKED_TOPICS = [
    "sexual_minors", "sexual_explicit", "non_consensual_intimate", "real_person_deception",
    "forged_document", "weapons_explosives",
]
THRESHOLD = 0.35


class Blocked(Exception):
    pass


def check_prompt(prompt, user):
    try:
        scores = classifier.score_text(prompt, topics=BLOCKED_TOPICS)
    except classifier.Unavailable:
        raise Blocked("Imagine is unavailable right now")   # no classifier, no image
    hit = [topic for topic, score in scores.items() if score >= THRESHOLD]
    if hit:
        classifier.log_block(user.id, topics=hit)
        raise Blocked("This prompt is not allowed")


def check_output(image):
    try:
        scores = classifier.score_image(image, topics=BLOCKED_TOPICS)
    except classifier.Unavailable:
        raise Blocked("Imagine is unavailable right now")
    if any(score >= THRESHOLD for score in scores.values()):
        raise Blocked("This image could not be created")
