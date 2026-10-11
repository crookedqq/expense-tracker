import pandas as pd

from .schemas import ExpenseIn


def to_frame(expenses: list[ExpenseIn]) -> pd.DataFrame:
    """Expenses -> DataFrame, with money converted to integer cents."""
    df = pd.DataFrame([e.model_dump() for e in expenses])
    if df.empty:
        return df
    df["date"] = pd.to_datetime(df["date"])
    df["cents"] = (df["amount"] * 100).round().astype(int)
    return df


def monthly_summary(df: pd.DataFrame) -> list[dict]:
    """Total per month, including months with no spending, plus % change."""
    if df.empty:
        return []
    by_month = df.groupby(df["date"].dt.to_period("M"))["cents"].sum()
    full_range = pd.period_range(by_month.index.min(), by_month.index.max(), freq="M")
    by_month = by_month.reindex(full_range, fill_value=0)

    result, previous = [], None
    for period, cents in by_month.items():
        change = round((cents - previous) / previous * 100, 1) if previous else None
        result.append({"month": str(period), "total_cents": int(cents), "change_pct": change})
        previous = cents
    return result


def category_breakdown(df: pd.DataFrame) -> list[dict]:
    """Total and share of spending per category, biggest first."""
    if df.empty:
        return []
    totals = df.groupby("category")["cents"].sum().sort_values(ascending=False)
    grand_total = totals.sum()
    return [
        {
            "category": category,
            "total_cents": int(cents),
            "share_pct": round(cents / grand_total * 100, 1),
        }
        for category, cents in totals.items()
    ]


def anomalies(df: pd.DataFrame, min_count: int = 5, threshold: float = 3.5) -> list[dict]:
    """Expenses unusually large for their category (modified z-score on the median)."""
    flagged = []
    if df.empty:
        return flagged
    for category, group in df.groupby("category"):
        if len(group) < min_count:
            continue  # not enough history to say what's "normal"
        median = group["cents"].median()
        mad = (group["cents"] - median).abs().median()
        if mad == 0:
            continue  # nearly identical amounts, so nothing to compare against
        scores = 0.6745 * (group["cents"] - median) / mad
        for idx in scores[scores > threshold].index:
            flagged.append(
                {
                    "id": group.loc[idx, "id"],
                    "expName": group.loc[idx, "expName"],
                    "category": category,
                    "amount_cents": int(group.loc[idx, "cents"]),
                    "typical_cents": int(median),
                    "score": round(float(scores[idx]), 1),
                }
            )
    return flagged