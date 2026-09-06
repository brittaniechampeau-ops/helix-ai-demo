#!/usr/bin/env python3
"""Build a local-only Britt-authored message corpus from LinkedIn's CSV export."""

import argparse
import csv
import hashlib
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


def parse_date(value):
    return datetime.strptime(value, "%Y-%m-%d %H:%M:%S UTC").replace(tzinfo=timezone.utc)


def normalize(value):
    return re.sub(r"\s+", " ", value or "").strip()


def classify(text):
    lower = text.lower()
    if any(x in lower for x in ("calendar", "calendly", "let's do", "lets do", "what time", "available", "schedule")):
        return "meeting_coordination"
    if any(x in lower for x in ("proposal", "scope", "engagement", "invoice", "rate", "budget", "paid", "client")):
        return "commercial_conversation"
    if any(x in lower for x in ("thank you", "thanks", "congratulations", "congrats", "great to connect")):
        return "warm_relationship_message"
    if any(x in lower for x in ("following up", "follow up", "checking in", "circle back")):
        return "follow_up"
    return "relationship_message"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("csv_path", type=Path)
    parser.add_argument("--since", default="2026-06-01")
    parser.add_argument("--output", type=Path, default=Path(__file__).parent / "private" / "linkedin-messages.jsonl")
    args = parser.parse_args()

    since = datetime.fromisoformat(args.since).replace(tzinfo=timezone.utc)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    rows = []
    seen = set()

    with args.csv_path.open(newline="", encoding="utf-8-sig") as handle:
        for source in csv.DictReader(handle):
            if normalize(source.get("FROM")) != "Britt Bowman":
                continue
            when = parse_date(source["DATE"])
            if when < since:
                continue
            text = normalize(source.get("CONTENT"))
            if not text:
                continue
            fingerprint = hashlib.sha256((when.isoformat() + "\n" + text).encode()).hexdigest()
            if fingerprint in seen:
                continue
            seen.add(fingerprint)
            rows.append({
                "id": "linkedin-message-" + fingerprint[:16],
                "author": "Britt Bowman",
                "channel": "linkedin_message",
                "voice_mode": classify(text),
                "privacy": "confidential",
                "captured_at": datetime.now(timezone.utc).date().isoformat(),
                "sent_at": when.isoformat(),
                "source": "linkedin_basic_export",
                "conversation_id": source.get("CONVERSATION ID"),
                "recipient": normalize(source.get("TO")),
                "quality": "sent_authoritative",
                "text": text,
            })

    rows.sort(key=lambda row: row["sent_at"])
    with args.output.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")

    counts = Counter(row["voice_mode"] for row in rows)
    print(json.dumps({
        "output": str(args.output),
        "since": args.since,
        "messages": len(rows),
        "by_mode": dict(sorted(counts.items())),
        "first": rows[0]["sent_at"] if rows else None,
        "last": rows[-1]["sent_at"] if rows else None,
    }, indent=2))


if __name__ == "__main__":
    main()

