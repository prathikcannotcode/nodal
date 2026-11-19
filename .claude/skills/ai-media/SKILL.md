---
name: ai-media
description: "Check the synthetically generated information duties added to the IT Rules in February 2026: filters against unlawful AI content on every generation path, a prominent label, provenance metadata with a unique identifier, and no code path that strips either. Use for \"AI label\", \"deepfake rules\", \"SGI\", \"provenance metadata\"."
---

# AI-generated media

## Trigger

"AI label", "AI-generated content", "deepfake", "synthetic media", "SGI", "provenance", "watermark", "C2PA"

## Purpose

Where the product lets users create or share AI-generated audio, images or video, check the three duties of rule 3(3) and the action duty in rule 3(1)(cb). Applies only to products tagged `sgi`. If the tag is absent, say so and stop.

## Legal basis

Catalog rules `IT-3-3-a-i`, `IT-3-3-a-ii`, `IT-3-3-b`, `IT-3-1-cb`. The user warnings in `IT-3-1-ca` belong to `/terms`. The upload declaration in `IT-4-1A` belongs to `/ssmi`.

## Method

List every path by which synthetic media comes into being or moves: text-to-image, image-to-image and edit, video, voice, API and batch routes, then share, download, export and re-upload. A product is as covered as its least covered path. Check each duty on each path.

## Checks

### 1. Filters against unlawful content (`IT-3-3-a-i`)

- Is there a prompt filter, an output classifier, or both?
- Does **every** generation path call it? Edit and image-to-image routes are where it is most often missing, and where a real person's photo enters. Check API routes, retries, and "fast" or "draft" modes.
- What happens when the filter errors or times out: block, or generate anyway?
- Any flag, role or tier that skips the filter.

A filter that exists on the main path but is skipped on another is a finding on the skipped path, with both files named.

### 2. Label and provenance (`IT-3-3-a-ii`)

- **Label.** Where is it applied: burned into the pixels, drawn by the client, or stored as a field the UI renders? A client-side badge disappears when the file is downloaded. Say which it is.
- **Audio.** The disclosure must come at the start.
- **Metadata.** What is written at generation (C2PA, XMP, EXIF, a custom tag), and does it include an identifier unique to the asset or the generator?
- The rule says "to the extent technically feasible" for metadata. If the product writes none, report it and let the company argue feasibility; do not argue it for them.

### 3. Nothing removes them (`IT-3-3-b`)

Follow a generated file after creation and look for anything that modifies, hides or strips the label or metadata:

- Media pipelines: resizers, thumbnailers, re-encoders, CDN transforms, "strip EXIF for privacy" steps. These are usually written for ordinary uploads and catch generated files by accident.
- Feature flags, creator programmes or paid tiers that turn the label off.
- Crop and export tools that let a user cut the label out.

Stripping metadata from ordinary user uploads is a privacy feature. It is a gap only where generated media passes through it.

### 4. A platform that hosts synthetic media it did not make (`IT-3-3-a-ii`, `IT-3-3-b`)

Read the catalog note on `IT-3-3-a-ii` first. Where `/classify` recorded that users can upload synthetic media made elsewhere:

- Does anything detect synthetic media on upload (a provenance metadata check, such as C2PA, or a classifier), and does a detected item get a label?
- Does the upload pipeline strip provenance metadata that arrived with the file? Check 3 applies to uploaded files as well as generated ones.

Whether rule 3(3) requires a host to detect and label media it did not make is a question of reading. Report the absence at medium at most, say in the issue text that the finding rests on reading the rule to reach hosts, and leave the question to counsel. For a significant social media intermediary, rule 4(1A) puts the duty beyond doubt: `/ssmi` covers it.

### 5. Acting on violations (`IT-3-1-cb`)

A report category for synthetic or deepfake content, and a moderation path that can remove the content and act on the account. Absence is "not found in the reviewed material".

## What is not a gap

- A label and metadata written correctly at generation. If a later step strips them, the gap is the later step; do not also report the generator.
- Editing features in the definition's carve-out: crop, colour, noise reduction, compression, transcription, translation, accessibility.
- The absence of a size or duration for the label: the notified text sets none.

## Guardrails

- Never generate content to test a filter. Read the code.
- Do not open stored user media.

## Commands

| Run | Action |
|---|---|
| `/ai-media` | Map the paths and run all five checks |
