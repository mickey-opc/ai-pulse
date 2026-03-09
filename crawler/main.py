from __future__ import annotations

import json

from sources import fetch_all


if __name__ == "__main__":
    print(json.dumps(fetch_all(), ensure_ascii=False, indent=2))
